package com.opticdev.common.storage

object DataDirectory {
  val root = PlatformConstants.dataDirectory

  val packages = PlatformConstants.dataDirectory / "packages"
  val parsers = PlatformConstants.dataDirectory / "parsers"
  val compiled = PlatformConstants.dataDirectory / "compiled"
  val sourcegear = PlatformConstants.dataDirectory / "sourcegear"


  def hasValidStructure = {
    root.isDirectory &&
      parsers.isDirectory &&
      packages.isDirectory &&
      compiled.isDirectory &&
      sourcegear.isDirectory
  }

  def buildDirectoryStructure = {
    root.createIfNotExists(asDirectory = true)
    parsers.createIfNotExists(asDirectory = true)
    packages.createIfNotExists(asDirectory = true)
    compiled.createIfNotExists(asDirectory = true)
    sourcegear.createIfNotExists(asDirectory = true)
  }

  def delete = root.delete(true)

  def reset = {
    delete
    buildDirectoryStructure
  }

}