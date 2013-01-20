#pragma strict

//public vars
public var Mate1 : GameObject;
public var Mate2 : GameObject;
public var Mate3 : GameObject;
public var Mate4 : GameObject;

public var MatePoint1 : GameObject;
public var MatePoint2 : GameObject;
public var MatePoint3 : GameObject;
public var MatePoint4 : GameObject;

public var Mated1 = false;
public var Mated2 = false;
public var Mated3 = false;
public var Mated4 = false;


public var Mate1Offset : Vector3;
public var Mate2Offset : Vector3;
public var Mate3Offset : Vector3;
public var Mate4Offset : Vector3;

//private vars
private var DragControls : DragControlsPC;
private var objectInfo : RaycastHit;
private var FirstGrab = true;
private var Selected = false;
private var offSet : Vector3;
private var oldPos : Vector3;
private var SnapDistance = 0.1;
private var done : boolean;

function Start () 
{
	//get drag controls script
	DragControls = Camera.main.GetComponent(DragControlsPC);
	
	//initialize mated
	if (Mate1 == null)
	{
		Mated1 = true;
	}
	if (Mate2 == null)
	{
		Mated2 = true;
	}
	if (Mate3 == null)
	{
		Mated3 = true;
	}
	if (Mate4 == null)
	{
		Mated4 = true;
	}
}

function Update () 
{
	done = false;
	//key dragging
	if (Input.GetMouseButtonDown(0))//selecting
	{			
		if (Physics.Raycast(Camera.main.WorldToScreenPoint(Vector3(Input.mousePosition.x,Input.mousePosition.y,Camera.main.transform.position.z)), Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x, Input.mousePosition.y, DragControls.WorldZDepth - Camera.main.transform.position.z)), objectInfo))
		{
			if (objectInfo.collider.name == this.name)
			{
				offSet = transform.position - Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x, Input.mousePosition.y,DragControls.WorldZDepth - Camera.main.transform.position.z));
				Selected = true;
			}
		}
	}
	
	if (Input.GetMouseButtonUp(0)) //unselecting
	{
		Selected = false;
	}
	
	if (Selected)//moving
	{
		transform.position = Camera.main.ScreenToWorldPoint(Vector3(Input.mousePosition.x,Input.mousePosition.y,DragControls.WorldZDepth - Camera.main.transform.position.z)) + offSet;	
		if (Mate1 != null && Mated1)
		{
			Mate1.GetComponent(KeyPiece).Move(transform.position - Mate1Offset, 1);
		}
		if (Mate2 != null && Mated2)
		{
			Mate2.GetComponent(KeyPiece).Move(transform.position - Mate2Offset, 2);
		}
		if (Mate3 != null && Mated3)
		{
			Mate3.GetComponent(KeyPiece).Move(transform.position - Mate3Offset, 3);
		}
		if (Mate4 != null && Mated4)
		{
			Mate4.GetComponent(KeyPiece).Move(transform.position - Mate4Offset, 4);
		}
	}
	
	
	//key mating
	if (Mate1 != null && !Mated1)//mate 1
	{
		if (Vector3.Distance(MatePoint1.transform.position, Mate1.GetComponent(KeyPiece).MatePoint1.transform.position) < SnapDistance)
		{
			Snap(1);
		}
	}
	if (Mate2 != null && !Mated2)//mate 2
	{
		if (Vector3.Distance(MatePoint2.transform.position, Mate2.GetComponent(KeyPiece).MatePoint2.transform.position) < SnapDistance)
		{
			Snap(2);
		}
	}
	if (Mate3 != null && !Mated3)//mate 3
	{
		if (Vector3.Distance(MatePoint3.transform.position, Mate3.GetComponent(KeyPiece).MatePoint3.transform.position) < SnapDistance)
		{
			Snap(3);
		}
	}
	if (Mate4 != null && !Mated4)//mate 4
	{
		if (Vector3.Distance(MatePoint4.transform.position, Mate4.GetComponent(KeyPiece).MatePoint4.transform.position) < SnapDistance)
		{
			Snap(4);
		}
	}
}

function Move(pos : Vector3, numFrom : int)
{
	if (!done)
	{
		done = true;
		transform.position = pos; //move self
		if (Mate1 != null && Mated1 && numFrom != 1) //move mate 1 if the Move did not come from that mate
		{
			Mate1.GetComponent(KeyPiece).Move(transform.position - Mate1Offset, 1);
		}
		if (Mate2 != null && Mated2 && numFrom != 2)
		{
			Mate2.GetComponent(KeyPiece).Move(transform.position - Mate2Offset, 2);
		}
		if (Mate3 != null && Mated3 && numFrom != 3)
		{
			Mate3.GetComponent(KeyPiece).Move(transform.position - Mate3Offset, 3);
		}
		if (Mate4 != null && Mated4 && numFrom != 4)
		{
			Mate4.GetComponent(KeyPiece).Move(transform.position - Mate4Offset, 4);
		}
	}
}

function Snap(numFrom : int)
{
	Selected = false;
	if (!done)
	{
		done = true;
		if (numFrom == 1) //mate point 1
		{
			Mated1 = true;
			Mate1.GetComponent(KeyPiece).Mated1 = true;
			transform.position = Mate1.transform.position + Mate1Offset;//snap self
			if (Mate2 != null && Mate2.GetComponent(KeyPiece).Mated2)//snap mate 2
			{
				Mate2.GetComponent(KeyPiece).Snap(2);
			}
			else if (Mate3 != null && Mate3.GetComponent(KeyPiece).Mated3)//snap mate 3
			{
				Mate3.GetComponent(KeyPiece).Snap(3);
			}
			else if (Mate4 != null && Mate4.GetComponent(KeyPiece).Mated4)//snap mate 3
			{
				Mate4.GetComponent(KeyPiece).Snap(4);
			}		
		}
		if (numFrom == 2) //mate point 2
		{
			Mated2 = true;
			Mate2.GetComponent(KeyPiece).Mated2 = true;
			transform.position = Mate2.transform.position + Mate2Offset;//snap self
			if (Mate1 != null && Mate1.GetComponent(KeyPiece).Mated1)//snap mate 1
			{
				Mate1.GetComponent(KeyPiece).Snap(1);
			}
			else if (Mate3 != null && Mate3.GetComponent(KeyPiece).Mated3)//snap mate 3
			{
				Mate3.GetComponent(KeyPiece).Snap(3);
			}
			else if (Mate4 != null && Mate4.GetComponent(KeyPiece).Mated4)//snap mate 3
			{
				Mate4.GetComponent(KeyPiece).Snap(4);
			}
		}
		if (numFrom == 3) //mate point 3
		{
			Mated3 = true;
			Mate3.GetComponent(KeyPiece).Mated3 = true;
			transform.position = Mate3.transform.position + Mate3Offset;//snap self
			if (Mate1 != null && Mate1.GetComponent(KeyPiece).Mated1)//snap mate 1
			{
				Mate1.GetComponent(KeyPiece).Snap(1);
			}
			else if (Mate2 != null && Mate2.GetComponent(KeyPiece).Mated2)//snap mate 2
			{
				Mate2.GetComponent(KeyPiece).Snap(2);
			}
			else if (Mate4 != null && Mate4.GetComponent(KeyPiece).Mated4)//snap mate 3
			{
				Mate4.GetComponent(KeyPiece).Snap(4);
			}
		}
		if (numFrom == 4) //mate point 3
		{
			Mated4 = true;
			Mate4.GetComponent(KeyPiece).Mated4 = true;
			transform.position = Mate4.transform.position + Mate4Offset;//snap self
			if (Mate1 != null && Mate1.GetComponent(KeyPiece).Mated1)//snap mate 1
			{
				Mate1.GetComponent(KeyPiece).Snap(1);
			}
			else if (Mate2 != null && Mate2.GetComponent(KeyPiece).Mated2)//snap mate 2
			{
				Mate2.GetComponent(KeyPiece).Snap(2);
			}
			else if (Mate3 != null && Mate3.GetComponent(KeyPiece).Mated3)//snap mate 3
			{
				Mate3.GetComponent(KeyPiece).Snap(3);
			}
		}
	}
	done = false;
}