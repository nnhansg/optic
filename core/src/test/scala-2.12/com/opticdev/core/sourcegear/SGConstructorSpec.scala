package com.opticdev.core.sourcegear

import better.files.File
import com.opticdev.core.Fixture.TestBase
import com.opticdev.core.sourcegear.project.config.ProjectFile
import com.opticdev.opm.{PackageManager, TestPackageProviders, TestProvider}
import com.opticdev.parsers.SourceParserManager
import org.scalatest.FunSpec

import scala.concurrent.duration._
import scala.concurrent.Await

class SGConstructorSpec extends TestBase with TestPackageProviders {

  lazy val projectFile = new ProjectFile(File("test-examples/resources/example_packages/express/optic.yaml"))

  it("can resolve all dependencies in a project file") {
    assert(SGConstructor.dependenciesForProjectFile(projectFile).get.toString == """Tree(Vector(Leaf(OpticPackage(optic:express-js,{"name":"express-js","author":"optic","version":"0.1.0","dependencies":{"optic:rest":"0.1.0"},"lenses":{"parameter":{"name":"Parameter","scope":"internal","schema":"optic:rest/parameter","snippet":{"name":"Parameter","language":"Javascript","version":"es6","block":"req.query.name"},"rules":[],"components":[{"type":"code","finder":{"type":"stringFinder","rule":"entire","string":"query","occurrence":0},"propertyPath":["in"]},{"type":"code","finder":{"type":"stringFinder","rule":"entire","string":"name","occurrence":0},"propertyPath":["name"]}]},"route":{"name":"Example Route","scope":"public","schema":"optic:rest/route","snippet":{"name":"Example Route","language":"Javascript","version":"es6","block":"app.get('url', function (req, res) {\n\n})"},"rules":[{"type":"children","finder":{"type":"stringFinder","rule":"starting","string":"{","occurrence":0},"ruleType":"any"}],"components":[{"type":"code","finder":{"type":"stringFinder","rule":"entire","string":"get","occurrence":0},"propertyPath":["method"]},{"type":"code","finder":{"type":"stringFinder","rule":"containing","string":"url","occurrence":0},"propertyPath":["url"]},{"type":"schema","schema":"optic:rest/parameter","propertyPath":["parameters"],"location":{"type":"InParent","finder":null},"options":{"lookupTable":null,"invariant":false,"parser":null,"mutator":null}}]}}}),Tree(Vector(Leaf(OpticPackage(optic:rest,{"name":"rest","author":"optic","version":"0.1.0","schemas":{"route":{"title":"Route","version":"1.0.0","type":"object","required":["method","url"],"properties":{"method":{"type":"string"},"url":{"type":"string"},"parameters":{"type":"array","items":{"$ref":"#/definitions/parameter"}}},"definitions":{"parameter":{"title":"Parameter","version":"1.0.0","slug":"js-example-route-parameter","type":"object","required":["method"],"properties":{"in":{"type":"string"},"name":{"type":"string"}}}},"exported":true},"parameter":{"title":"Parameter","version":"1.0.0","type":"object","required":["method"],"properties":{"in":{"type":"string"},"name":{"type":"string"}}}}}),Tree(Vector())))))))""")
  }

  it("can compile dependencies") {
    val output = SGConstructor.compileDependencyTree(SGConstructor.dependenciesForProjectFile(projectFile).get)
    assert(output.isSuccess)
  }

  it("can build a sourcegear instance") {
    lazy val sgConfig = {
      val future = SGConstructor.fromProjectFile(new ProjectFile(File("test-examples/resources/example_packages/express/optic.yaml")))
      Await.result(future, 5 seconds)
    }
    assert(sgConfig.gears.size == 2)
  }

}