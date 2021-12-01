
● Please solve these tasks in TypeScript.<br>
● Please commit your code to a Git repo we can access. 

# Task 
<p>There is given a rectangular bitmap of size <b>n</b>*<b>m</b>. Each pixel of the bitmap is either white or black, but at least one is white.<br> The pixel in <b>i</b>-th line and <b>j</b>-th column is called the pixel <code>(i,j)</code>. <br>The distance between two pixels <code>p1=(i1,j1)</code> and <code>p2=(i2,j2)</code> is defined as

```
d(p1,p2)=|i1-i2|+|j1-j2|
```
Write a program which: </p>

● reads the description of the bitmap from the standard input; <br>
● for each pixel, computes the distance to the nearest white; <br>
● writes the results to the standard output. 

# Input 
 <p>The number of test cases <b>t</b> <code>1≤t≤1000</code> is in the first line of input, then <b>t</b> test cases follow separated by an empty line.<br> In the first line of each test case there is a pair of integer numbers <b>n</b>, <b>m</b> separated by a single space, <code>1<=n <=182</code>, <code>1<=m<=182</code>. <br> In each of the following <b>n</b> lines of the test case exactly one zero-one word of length <b>m</b>, the description of one line of the bitmap, is written.<br> On the <b>j</b>-th position in the line <code>i+1</code>, <code>1 <= i <= n</code>, <code>1 <= j <= m</code>, is '1' if, and only if the pixel <code>(i,j)</code> is white. </p>

# Output 
In the <b>i</b>-th line for each test case, <code>1<=i<=n</code>, there should be written <b>m</b> integers <code>f(i,1),...,f(i,m)</code> separated by single spaces, where <code>f(i,j)</code> is the distance from the pixel <code>(i,j)</code> to the nearest white pixel.<br><br> Example:<br><br> 
Input:
```
1 
3 4 
0001 
0011 
0110
``` 
Output
``` 
3 2 1 0 
2 1 0 0 
1 0 0 1
```