#pragma strict

public var Enabled : boolean;

private var xT : boolean;
private var yT : boolean;
private var zT : boolean;
private var xSpeed : float = .001;
private var ySpeed : float = .001;
private var zSpeed : float = .001;

/*var atDest : boolean;
var prevDest : Vector3;
var nexDest : Vector3;
var destDif : Vector3;
*/

function Start()
{
	if (Enabled)
	{
		transform.localPosition = Vector3(Random.Range(-1,2),Random.Range(-1,2),Random.Range(-1,2));
		if(transform.localPosition.x == 0)
		{
			xT = false;
		}
		if(transform.localPosition.y == 0)
		{
			yT = false;
		}
		if(transform.localPosition.z == 0)
		{
			zT = true;
		}
	}
	
	/*prevDest = transform.localPosition;
	nexDest = Vector3(Random.Range(0,2),0,Random.Range(0,2));
	destDif = nexDest - prevDest;
	*/
}
function Update() 
{
	if (Enabled)
	{
		if(xSpeed == 0)
		{
			xSpeed = .001;
		}
		if(ySpeed == 0)
		{
			ySpeed = .001;
		}
		if(zSpeed == 0)
		{
			zSpeed = .001;
		}
		transform.LookAt(transform.parent.transform);
		
		if((xT && yT && zT) || (!xT && !yT && !zT))
		{
			zT = !zT;
		}
		if(transform.localPosition.x >= 1)
		{
			xT = false;
			xSpeed = .001;
		}
		
		if(transform.localPosition.y >= 1)
		{
			yT = false;
			ySpeed = .001;
		}
		
		if(transform.localPosition.z >= 1)
		{
			zT = false;
			zSpeed = .001;
		}
		
		if(transform.localPosition.x > 1.2)
		{
			xT = false;
			xSpeed = .1;
		}
		if(transform.localPosition.y > 1.2)
		{
			yT = false;
			ySpeed = .1;
		}
		if(transform.localPosition.z > 1.2)
		{
			zT = false;
			zSpeed = .1;
		}
		//#########
		if(transform.localPosition.x <= -1)
		{
			xT = true;
			xSpeed = .001;
		}
		if(transform.localPosition.y <= -1)
		{
			yT = true;
			ySpeed = .001;
		}
		if(transform.localPosition.z <=  -1)
		{
			zT = true;
			zSpeed = .001;
		}
		
		if(transform.localPosition.x < -1.2)
		{
			xT = true;
			xSpeed = .1;
		}
		if(transform.localPosition.y < -1.2)
		{
			yT = true;
			ySpeed = .1;
		}
		if(transform.localPosition.z < -1.2)
		{
			zT = true;
			zSpeed = .1;
		}
		//########
		if(xT)
		{
			transform.localPosition.x += xSpeed;
		}
		else
		{
			transform.localPosition.x -= xSpeed;
		}
		if(yT)
		{
			transform.localPosition.y += ySpeed;
		}
		else
		{
			transform.localPosition.y -= ySpeed;
		}
		if(zT)
		{
			transform.localPosition.z += zSpeed;
		}
		else
		{
			transform.localPosition.z -= zSpeed;
		}
	}
		
		
	if (transform.parent == null)
	{
		Destroy(gameObject);
	}
	/*if(transform.localPosition == nexDest)
	{
		atDest = true;
	}
	else
	{
		atDest = false;
	}
	
	if(!atDest)
	{
		if(destDif.x < 0)
		{
			transform.localPosition.x -= .01;
		}
		if(destDif.x > 0)
		{
			transform.localPosition.x += .01;
		}
		if(destDif.y < 0)
		{
			transform.localPosition.y -= .01;
		}
		if(destDif.y > 0)
		{
			transform.localPosition.y += .01;
		}
		if(destDif.z < 0)
		{
			transform.localPosition.z -= .01;
		}
		if(destDif.z > 0)
		{
			transform.localPosition.z += .01;
		}
		
	}
	else
	{
		prevDest = nexDest;
		nexDest = Vector3(Random.Range(0,2),0,Random.Range(0,2));
		destDif = nexDest - prevDest;
	}*/
	
}

