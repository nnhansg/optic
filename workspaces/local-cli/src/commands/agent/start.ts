import { Command } from '@oclif/command';
import * as uuid from 'uuid';
import { SaasClient } from '@useoptic/cli-shared';
import fs from 'fs-extra';
import {
  developerDebugLogger,
  loadPathsAndConfig,
  SaasCaptureSaver,
} from '@useoptic/cli-shared';
import { CliTaskSession } from '@useoptic/cli-shared/build/tasks';
import { AgentCliTaskRunner } from '../../shared/agent-cli-task-runner';
import Config from '../../config';
import UrlJoin from 'url-join';

export default class Start extends Command {
  static description =
    'starts your API process behind a proxy and sends traffic metadata to the cloud';

  async run() {
    const baseUrl = UrlJoin(Config.apiGatewayUrl, 'api/v1');

    const agentGroupId = 'pokeapi-crawler';
    const orgId = 'optic-testing';
    const apiName = 'optic-testing-api';
    const captureId = uuid.v4();
    const reportUrl = `${baseUrl}/capture-reports/orgs/${orgId}/agentGroups/${agentGroupId}/captures/${captureId}`;
    const agentId = uuid.v4();
    const tokenContents = {
      agentGroupId,
      orgId,
      captureId,
    };
    const tokenString = Buffer.from(JSON.stringify(tokenContents)).toString(
      'base64'
    );

    // start a new capture
    const saasClient = new SaasClient(baseUrl, tokenString);
    developerDebugLogger('getting auth token');
    const authToken = await saasClient.getApiAuthToken(apiName);
    saasClient.setAuthToken(authToken);

    developerDebugLogger('getting spec upload url');
    const { uploadUrl } = await saasClient.getSpecUploadUrl();
    developerDebugLogger('uploading spec');
    const { paths, config } = await loadPathsAndConfig(this);
    const { specStorePath } = paths;
    const events = await fs.readJson(specStorePath);
    await saasClient.uploadSpec(uploadUrl, events);

    const persistenceManager = new SaasCaptureSaver({
      orgId,
      agentGroupId,
      agentId,
      baseUrl,
      launchTokenString: tokenString,
      captureId,
    });

    this.log(`Access your report at ${reportUrl}`);
    const runner = new AgentCliTaskRunner(persistenceManager);
    const cliTaskSession = new CliTaskSession(runner);
    await cliTaskSession.start(this, config, 'start');
    this.log(`Access your report at ${reportUrl}`);
  }
}