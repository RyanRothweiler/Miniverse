#pragma strict

public var DragTex : Texture;
public var TouchTex : Texture;

private var DragControls : DragControlsPC;

function Start () 
{
	//get drag controls
	DragControls = Camera.main.GetComponent(DragControlsPC);
}

function Update () 
{
	//touch controls
	if (DragControls.Touching1) //change to drag
	{
		renderer.material.mainTexture = DragTex;
	}
	else
	{
		renderer.material.mainTexture = TouchTex;
	}
}