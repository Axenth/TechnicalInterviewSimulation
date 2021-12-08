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

var tests = new Array<test>();
var test : test;

function stdinToString(): string
{
	stdin = '';
	do // Loop as long as stdin input is available.
	{
		bytesRead = 0;
		try
		{
			bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE, null);
		}
		catch (e)
		{
			if (e.code === 'EAGAIN')
			{
				throw 'ERROR: interactive stdin input not supported.';
		  	}
			else if (e.code === 'EOF')
				break;
		  	throw e;
		}
		if (bytesRead === 0)
			break;
 		stdin += buf.toString(undefined, 0, bytesRead);
	} while (bytesRead > 0);
	return stdin;
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

function validLine(lineCount: number, line: string, currLine: number, maxLines: number): boolean
{
	if (lineCount === 0) // Gets the test size and should only be called once!
	{
		let endOfNumber: boolean = false;
		for(let i = 0; i < line.length; i++)
		{
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
	switch(lineCount)
	{
	case 1:// gets the test width & height
		test = {width: 0, height: 0, map: [], output: []};
		let sizeArray: string[] = line.split(' ');
		let size: number = parseInt(sizeArray[0]);
		let size2: number = parseInt(sizeArray[1]);
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
		let white: number = 0;
		for (let x: number = 0; x < s.length; x++)
			if (s[x][0] === '1')
				white++;
		if (white === 0)
			return (false);
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

function newFindNearestWhite(testsToRun: test, point: point)
{
	var distance: number = Number.MAX_VALUE;
	var sameLine: point = {x: 0, y: 0};
	
	for(let x: number = 0; x < testsToRun.width; x++)
	{
		if (testsToRun.map[point.y][x] === 1)
		{
			if (Math.abs(x - point.x) < distance)
			{
				distance = Math.abs(x - point.x);
				sameLine.x = x;
				sameLine.y = point.y;
			}
		}
	}
	var oldDistance: number = distance;
	var found: boolean = false;
	for(let y: number = point.y - oldDistance; y < point.y + distance; y++)
	{
		if (y < 0)
			y = 0;
		if (y === testsToRun.height)
			break;
		for(let x: number = point.x - oldDistance; x < point.x + distance; x++)
		{
			if (x < 0)
				x = 0;
			if (x === testsToRun.width)
				break;
			if (testsToRun.map[y][x] === 1)
			{
				let newDistance: number = Math.abs(x - point.x) + Math.abs(y - point.y);
				if (newDistance <= distance)
				{
					distance = newDistance;
					testsToRun.output[point.y][point.x] = distance;
					found = true;
				}
			}
		}
	}
	if (found === false)
		testsToRun.output[point.y][point.x] = oldDistance;
}

// function findNearestWhite(testToRun: test, point: point)
// {
// 	var max: number = Number.MAX_VALUE;
// 	for (let y: number = 0; y < testToRun.height; y++)
// 		for (let x: number = 0; x < testToRun.width; x++)
// 			if (testToRun.map[y][x] === 1)
// 			{
// 				var distance: number = Math.abs(x - point.x) + Math.abs(y - point.y);
// 				if (distance < max)
// 				{
// 					max = distance;
// 					testToRun.output[point.y][point.x] = distance;
// 				}
// 			}
// }

function main()
{
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
				newFindNearestWhite(tests[i], {x: x, y: y});
		printOutput(tests[i]);
		console.log("");
	}
}
main();