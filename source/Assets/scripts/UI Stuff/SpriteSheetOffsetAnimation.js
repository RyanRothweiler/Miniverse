#pragma strict

//runs top to bottom, then left to right.

//public vars
public var FrameNum : int;
public var CurrentFrame : int;
public var FrameSize : Vector2;
public var SheetSize : Vector2;
public var FramesX : int;
public var Speed : float;

//private vars
private var i : float;
private var xRatio : float;
private var yRatio : float;
private var col : int;
private var row : int;

function Start () 
{
	//get ratios
	xRatio = (FrameSize.x / SheetSize.x) * 2;
	yRatio = (FrameSize.y / SheetSize.y) * 2;
	
	//init
	i = 0;
	col = -1;
	row = 0;
	CurrentFrame = 0;
}

function Update () 
{
//	print("row " + row);
//	print("col " + col);
	
	if (i > Speed) //fps... sorta. to lazy to actually code frames per second but this works just the same
	{
		if (row > FramesX - 2)
		{
			row = 0;
			col--;
			IncrementFrame();
		}
		else
		{
			row++;
			IncrementFrame();
		}
		i = 0;
	}
	else
	{
		i += Time.deltaTime;
	}
	
	renderer.material.mainTextureOffset = Vector2(row * xRatio,(col * yRatio) - (0.0009 * col));
}

function IncrementFrame()
{
	if (CurrentFrame + 1 > FrameNum)
	{
		//loop back
		row = 0;
		col = -1;
		CurrentFrame = 1;
	}
	else
	{
		CurrentFrame++;
	}
}