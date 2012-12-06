crosstalk-ide
=============

`crosstalk-ide` is a Crosstalk Swarm emulator enabling local Crosstalk Worker development and testing.

## Installation

    npm install crosstalk-ide

## Usage

For starters, take a look at the `examples` folder and run the examples via:

    node example.js

This simple initial example illustrates how to use the crosstalk-development-environment in order to run workers. 

With `example.js` as a start, the next place to look would be at `crosstalk.js` which creates the Crosstalk sandbox that a worker runs in. That is the complete list of emulated worker functionality.

Finally, for now, `addTestingArtifacts.js` shows more of the testing functionality available in the development environment.

More examples are forthcoming.

## HOWTOs

[How to build a "Hello World" Crosstalk worker](/crosstalk/crosstalk-ide/wiki/Hello-World-HOWTO)

## Crosstalk worker environment

[Crosstalk global object and available modules](/crosstalk/crosstalk-ide/wiki/Crosstalk-environment)
