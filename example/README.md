# nad example

This is a simple example to show how to generate a node project that includes given addon code.

The `binding.gyp` declares two targets, `hello` and `greet`. 

- hello: just a simple C++ function that returns the string `"world"`
- greet: wraps the C library `./deps/greeter` which takes a `name` to return `"hello <name>"`

To play with this, do the following (assuming you have nad installed).

```sh
git clone https://github.com/thlorenz/nad && cd nad/example
nad build
nad open
```

At this point you should have an Xcode project open up which you can build and run.

## Test It

You can then run `hello.js` or `greeter.js` with the node app open in Xcode and debug through the C++ code. 
