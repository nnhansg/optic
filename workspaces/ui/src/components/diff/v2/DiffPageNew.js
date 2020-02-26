import React, {useState} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {AppBar, Button, Typography} from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import {ArrowDownwardSharp} from '@material-ui/icons';
import compose from 'lodash.compose';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {DocGrid} from '../../requests/DocGrid';
import {EndpointsContext, EndpointsContextStore, withEndpointsContext} from '../../../contexts/EndpointContext';
import {TrafficSessionContext, TrafficSessionStore} from '../../../contexts/TrafficSessionContext';
import {withSpecServiceContext} from '../../../contexts/SpecServiceContext';
import {DiffContextStore, withDiffContext} from './DiffContext';
import {withRfcContext} from '../../../contexts/RfcContext';
import LinearProgress from '@material-ui/core/LinearProgress';
import {BodyUtilities, JsonHelper, opticEngine} from '@useoptic/domain';
import DiffViewer from './DiffViewer';
import {ExampleShapeViewer} from '../../requests/DocCodeBox';
import {HighlightedIDsStore} from '../../shapes/HighlightedIDs';
import niceTry from 'nice-try'
import {NamerStore} from '../../shapes/Namer';

const styles = theme => ({
  root: {
    maxWidth: '90%',
    paddingTop: 15,
    margin: '0 auto',
    paddingBottom: 120
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100vh'
  },
  scroll: {
    overflow: 'scroll',
    paddingBottom: 300,
    paddingTop: 20,
  },
  appBar: {
    borderBottom: '1px solid #e2e2e2',
    backgroundColor: 'white'
  },
});

class DiffPageNew extends React.Component {
  render() {

    const {classes, specStore} = this.props;
    const {pathId, method, sessionId} = this.props.match.params;

    return (
      <CaptureSessionInlineContext specStore={specStore} sessionId={sessionId}>
        <EndpointsContextStore pathId={pathId} method={method}>
          <DiffPageContent/>
        </EndpointsContextStore>
      </CaptureSessionInlineContext>
    );
  }
}


class _DiffPageContent extends React.Component {
  render() {
    const {endpointDescriptor, classes, regionNames, currentExample} = this.props;
    const {fullPath, httpMethod, endpointPurpose, pathParameters, responses} = endpointDescriptor;


    const responseRegionRegex = /response-body-([0-9]{3})/;

    const responseRegions = regionNames.map(i => {
      const match = responseRegionRegex.exec(i);
      if (match) {
        return parseInt(match[1]);
      }
    }).filter(i => !!i);

    const responsesToRender = Array.from(new Set([...responseRegions, ...responses.map(i => i.statusCode)])).sort((a, b) => a - b);

    const RequestBodyRegion = () => {
      return (
        <DocGrid
          left={(
            <div>
              Request body
              <DiffViewer regionName={'request-body'}/>
            </div>
          )} right={(<div>spec {currentExample && currentExample.toString()}</div>)}/>
      );
    };

    const ResponseBodyRegion = ({statusCode}) => {

      console.log(currentExample)
      const showExample = currentExample && currentExample.response.statusCode === statusCode;
      const contentTypes = responses.filter(i => i.statusCode === statusCode);

      return (
        <DocGrid
          left={(
            <div>
              {statusCode} Response
              <DiffViewer regionName={`response-body-${statusCode}`}/>
            </div>
          )} right={(<div>
          {contentTypes.map(response => {
            const hasBody = response.responseBody.shapeId && !response.responseBody.isRemoved;
            if (hasBody) {
              const contentType = response.responseBody.httpContentType;
              const example = currentExample && niceTry(() => JsonHelper.toJs(BodyUtilities.parseJsonBody(currentExample.response.body)))
              return (
                <ExampleShapeViewer
                  title={`${statusCode} Response Body`}
                  shapeId={response.responseBody.shapeId}
                  contentType={contentType}
                  showShapesFirst={true}
                  example={example}/>
              );
            }
          })}
        </div>)}
        />
      );
    };


    return (
      <div className={classes.container}>
        <AppBar position="static" color="default" className={classes.appBar} elevation={0}>
          <Toolbar variant="dense">
            <div style={{flex: 1, textAlign: 'center'}}>
              <Typography variant="h6" color="primary">{'ABC'}</Typography>
            </div>
            <div>
              <Typography variant="caption" style={{marginRight: 9}}>(0) Changes</Typography>
              <Button color="primary">Apply Changes</Button>
            </div>
          </Toolbar>
        </AppBar>

        <div className={classes.scroll}>
          <div className={classes.root}>
            <HighlightedIDsStore>
              <NamerStore disable={true}>

                <RequestBodyRegion/>

                {responsesToRender.map(responseStatusCode => <ResponseBodyRegion statusCode={responseStatusCode}/>)}

              </NamerStore>
            </HighlightedIDsStore>
          </div>
        </div>
      </div>
    );
  }
}

const DiffPageContent = compose(withStyles(styles), withDiffContext, withEndpointsContext)(_DiffPageContent);

class _CaptureSessionInlineContext extends React.Component {

  render() {
    const {
      rfcId,
      rfcService,
      sessionId,
      specService,
      children,
      cachedQueryResults,
      queries
    } = this.props;
    return (
      //@todo refactor sessionId to captureId
      <TrafficSessionStore sessionId={sessionId} specService={specService} r
                           enderNoSession={<div>No Capture</div>}>
        <TrafficSessionContext.Consumer>
          {(context) => {

            const {isLoading} = context;
            if (isLoading) {
              return <LinearProgress/>;
            }

            const {contexts, diff, JsonHelper} = opticEngine.com.useoptic;
            const jsonHelper = JsonHelper();
            const {helpers} = diff;
            const rfcState = rfcService.currentState(rfcId);

            const samples = jsonHelper.jsArrayToSeq(context.session.samples.map(i => jsonHelper.fromInteraction(i)));
            const diffResults = helpers.DiffHelpers().groupByDiffs(rfcState, samples);
            const diffHelper = helpers.DiffResultHelpers(diffResults);
            const regions = diffHelper.listRegions();
            const regionNames = jsonHelper.seqToJsArray(regions.keys());

            const getInteractionsForDiff = (diff) => jsonHelper.seqToJsArray(diffHelper.get(diff));
            const getDiffsByRegion = (groupName) => jsonHelper.seqToJsArray(regions.getDiffsByRegion(groupName));

            const interpreter = diff.interactions.interpreters.BasicInterpreters(rfcState)

            const interpretationsForDiffAndInteraction = (diff, interaction) =>  jsonHelper.seqToJsArray(interpreter.interpret(diff, interaction))

            return (
              <DiffContextStore
                regionNames={regionNames}
                getDiffsByRegion={getDiffsByRegion}
                interpretationsForDiffAndInteraction={interpretationsForDiffAndInteraction}
                getInteractionsForDiff={getInteractionsForDiff}>
                {children}
              </DiffContextStore>
            );

          }}
        </TrafficSessionContext.Consumer>
      </TrafficSessionStore>
    );
  }
};

const CaptureSessionInlineContext = compose(withRfcContext)(_CaptureSessionInlineContext);


function BatchActionsMenu(props) {

  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <>
      <Button
        color="secondary"
        size="small"
        onClick={(e) => setAnchorEl(e.target)}
        style={{marginLeft: 12}}
        endIcon={<ArrowDownwardSharp/>}>
        Batch Actions</Button>
      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} anchorOrigin={{vertical: 'bottom'}}
            onClose={() => setAnchorEl(null)}>
        <MenuItem>Accept all Suggestions</MenuItem>
        <MenuItem>Ignore all Diffs</MenuItem>
        <MenuItem>Reset</MenuItem>
      </Menu>
    </>
  );

}

export default compose(withStyles(styles), withSpecServiceContext)(DiffPageNew);