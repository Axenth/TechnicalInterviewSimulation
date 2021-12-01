import * as fs from 'fs';
import { exit } from 'process';
const BUFSIZE = 256;
const buf = Buffer.alloc(BUFSIZE);
var bytesRead: number;
var stdin: string;
var testSize: number;
var input: string[];

interface test
{
	width: number;
	height: number;
	map: number[][];
	output: number[][];
}

interface point
{
	x: number;
	y: number;
}

let tests = new Array<test>();
var test : test;


function stdinToString(): string {
  stdin = '';
  do {
    // Loop as long as stdin input is available.
    bytesRead = 0;
    try {
      bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE, null);
    } catch (e) {
      if (e.code === 'EAGAIN') {
        throw 'ERROR: interactive stdin input not supported.';
      } else if (e.code === 'EOF') {
        break;
      }
      throw e;
    }
    if (bytesRead === 0) {
      break;
    }
 	stdin += buf.toString(undefined, 0, bytesRead);
  } while (bytesRead > 0);
  return stdin;
}

function printArray(array: string[]) {
  for (let i = 0; i < array.length; i++) {
	console.log(array[i]);
  }
}

function printTest(testToPrint: test)
{
	console.log("WIDTH: " + testToPrint.width + " HEIGHT " + testToPrint.height);
	console.log("input:");
	for (let i = 0; i < testToPrint.height; i++)
		console.log(testToPrint.map[i]);
	console.log("output:");
	for (let i = 0; i < testToPrint.height; i++)
		console.log(testToPrint.output[i]);
}

function printOutput(testToPrint: test)
{
	let out: string = '';
	for (let i = 0; i < testToPrint.height; i++)
	{	
		for (let j = 0; j < testToPrint.width; j++)
		{
			out += testToPrint.output[i][j];
			if (j !== testToPrint.width - 1)
				out += " ";
		}
		console.log(out);
		out = '';	
	}
}

function validLine(lineCount: number, line: string, currLine: number, maxLines: number): boolean {
	if (lineCount === 0) { // Gets the test size and should only be called once!
	var endOfNumber: boolean = false;
	for(let i = 0; i < line.length; i++) {
	  if (line[i] === ' ') 
		endOfNumber = true;
	  if(endOfNumber && line[i] !== ' ')
		return false;
	}
	testSize = parseInt(line);
	if(testSize < 1 || testSize > 1000)
	  return false;
	return (true);
	}
	switch(lineCount) {
		case 1:// gets the test width & height
			test = {width: 0, height: 0, map: [], output: []};
			var sizeArray: string[] = line.split(' ');
			var size: number = parseInt(sizeArray[0]);
			var size2: number = parseInt(sizeArray[1]);
			if (size < 1 || size > 182 || size2 < 1 || size2 > 182)
				return false;

			test.height = size;
			test.width = size2;
			return (true);
		case 2:// gets the test map
			let s: string[] = line.split("");
			while(s[s.length - 1] === ' ')
				s.pop();
			let ArraySize: number = 0; // FIXME: this should be size of s now not this unnessecary loop
			for (let i = 0; i < s.length; i++)
				if (s[i] !== ' ')
					ArraySize++;
			if (ArraySize !== test.width)
				return false;
			let col: number[] = s.map(Number);
			test.map.push(col);
			if (currLine !== maxLines)
				return (true);
		case 3:// new line/ EOF indicating end of test
			if(test.map.length === test.height)
			{
				// initialize output to 0
				for (let i = 0; i < test.height; i++)
				{
					let col: number[] = [];
					for (let j = 0; j < test.width; j++)
						col.push(0);
					if (test.map[i].length !== test.width)
						return (false);
					test.output.push(col);
				}
				tests.push(test);
			}
			test = {width: 0, height: 0, map: [], output: []};
			return (true);
		default:
			return (true);
	}
}

function getLineType(line: string): number
{
	var i: number = 0;
	if (line[0] === undefined)
		return (3);
	// if (line[0] >= '0' && line[0] <= '9')
	// {
	// 	while(line[i] >= '0' && line[i] < '9')
	// 		i++;
	// 	while(line[i] == ' ')
	// 		i++;
	// 	if(line[i] == undefined)
	// 		return 0;
	// }
	// i = 0;
	    if(line[0] >= '0' && line[0] <= '9')
		{
			while(line[i] >= '0' && line[i] <= '9')
				i++;
			if (line[i] === ' ')
				i++;
			if (line[i] >= '0' && line[i] <= '9')
			{
				while(line[i] >= '0' && line[i] <= '9')
					i++;
				while(line[i] == ' ')
					i++;
				if (line[i] === undefined)
					return (1);
			}
		}
	i = 0;
		while(line[i] >= '0' && line[i] <= '9')
			i++;
		while(line[i] == ' ')
			i++;
		if (line[i] == undefined)
			return (2);

	return (-1);
}

function findNearestWhite(testToRun: test, point: point)
{
	var max: number = Number.MAX_VALUE;
	for (let y: number = 0; y < testToRun.height; y++)
		for (let x: number = 0; x < testToRun.width; x++)
			if (testToRun.map[y][x] === 1)
			{
				var distance: number = Math.abs(x - point.x) + Math.abs(y - point.y);
				if (distance < max)
				{
					max = distance;
					testToRun.output[point.y][point.x] = distance;
				}
			}
}
input = stdinToString().split('\n');

validLine(0, input[0], 0, input.length -1);

for (let i = 1; i < input.length; i++)
{
	let lineType: number = getLineType(input[i]);
	if (validLine(lineType, input[i], i, input.length - 1) === false)
	{
		console.log('ERROR: 1 or more tests are invalid!');
		exit(1);
	}
}

for (let i: number = 0; i < tests.length; i++)
{
	for (let y: number = 0; y < tests[i].height; y++)
		for (let x: number = 0; x < tests[i].width; x++)
			findNearestWhite(tests[i], {x: x, y: y});
	// printTest(tests[i]);
	printOutput(tests[i]);
	console.log("");
}
