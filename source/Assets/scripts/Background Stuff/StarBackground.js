#pragma strict


//public vars
public var FadeMax : float;
public var FadeMin : float;
public var FadeSpeed : float;
static public var alpha : float;

//private vars
private var mat : Material;
static private var fadeDown = false;
static private var fadeUp = false;
private var dragControls : DragControlsPC;

function Start () 
{
	//get renderer
	mat = GetComponentInChildren(Renderer).material;
	
	//set drag controls
	dragControls = Camera.main.GetComponent(DragControlsPC);
	
	//start alpha
	mat.color.a = alpha;
}

function Update () 
{
	//set fading
	if (mat.color.a == FadeMax)
	{
		fadeDown = true;
	}
	if (mat.color.a == FadeMin)
	{
		fadeUp = true;
	}
	
	//fade
	if (fadeDown && !dragControls.Transitioning)
	{
		mat.color.a -= FadeSpeed;
		if (mat.color.a <= FadeMin)
		{
			mat.color.a = FadeMin;
			fadeDown = false;
		}
		alpha = mat.color.a;
	}
	if (fadeUp && !dragControls.Transitioning)
	{
		mat.color.a += FadeSpeed;
		if (mat.color.a >= FadeMax)
		{
			mat.color.a = FadeMax;
			fadeUp = false;
		}
		alpha = mat.color.a;
	}
}