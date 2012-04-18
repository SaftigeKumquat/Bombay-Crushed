#!/usr/bin/env node

console.log('Hello, World!');

var startCollecting = function() {
	// for purpose of demonstration assume three parts
	var part1, part2, part3;

	// function which in the end processes all data
	var finish = function() {
		if(part1 !== undefined && part2 !== undefined && part3 !== undefined) {
			console.log('All done!');
			console.log('1: ' + part1);
			console.log('2: ' + part2);
			console.log('3: ' + part3);
		} else {
			console.log('Still waiting for data');
		}
	};

	// functions via which the data can be set
	// this functions could be directly used as callbacks
	var setPart1 = function(data) {
		part1 = data;
		finish();
	}
	var setPart2 = function(data) {
		part2 = data;
		finish();
	}
	var setPart3 = function(data) {
		part3 = data;
		finish();
	}

	// the object which can be used to set the data, e.g. as a callback
	// this is only required because in this example so we can pass the
	// setter functions as a return value
	var state = {
		setPart1: setPart1,
		setPart2: setPart2,
		setPart3: setPart3
	}

	return state;
}

// show it works
state = startCollecting();
state.setPart1('bla');
state.setPart2('blu');
state.setPart3('blop');

console.log();

// resorted input
state = startCollecting();
state.setPart3('blop');
state.setPart2('blu');
state.setPart1('bla');

console.log();

// yet another input order
state = startCollecting();
state.setPart2('blu');
state.setPart1('bla');
state.setPart3('blop');

// two data collections running interleaved
state = startCollecting();
state2 = startCollecting();
state.setPart2('1.2');
state2.setPart1('2.1');
state2.setPart3('2.3');
state.setPart1('1.1');
state2.setPart2('2.2');
state.setPart3('1.3');
