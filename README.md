# AwayJS Renderer
[![Build Status](https://travis-ci.org/awayjs/renderer.svg?branch=dev)](https://travis-ci.org/awayjs/renderer)

Interface for scene and material modules, providing simpified rendering for complex heriarchies.

## Documentation

[Official AwayJS Documentation](https://awayjs.github.io/docs/renderer)

## AwayJS Dependencies

* core
* graphics
* scene
* stage

## Internal Structure

* animators<br>
Data and renderer classes for shape animation functionality. (Data classes to be split into animation module)

* elements<br>
Abstractions for elements classes (to be moved to stage module)

* errors<br>
Error types

* events<br>
Event objects for renderer classes

* filters<br>
Data and renderer classes for global filter effects (Data classes to be split into scene module)

* managers<br>
Render to Texture helper class (deprecated)

* materials<br>
Abstractions for material classes

* renderables<br>
Abstractions for renderable classes eg Billboard, LineSegment, Skybox (Shape to be moved to stage module)

* shaders<br>
Data object for representing state and functionality of a shader (base classes to be moved to stage)

* sort<br>
Merge sort classes acting on linked lists of renderables

* textures<br>
Abstractions for texture classes (to be moved to stage module)

* utils<br>
Helpers for particle animations