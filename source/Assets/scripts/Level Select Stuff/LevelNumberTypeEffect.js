#pragma strict

//public vars
public var LevelTags : GameObject;
public var NumberMat : Material;
public var NextLevelReady = false;

//private vars
private var numbers : GameObject[];
private var names = new Array ();
private var times = new Array ();

private var prevLevel : int; //level num of the previous level
private var i : int;
private var j : int;
private var numNext = 0;
private var swapped = false;
private var dummyObj : GameObject;
private var Running = false;
private var virgin = true;
private var hit : RaycastHit;
private var awayStart : int;


function Start () 
{
	//get the previous level
	prevLevel = Camera.main.GetComponent(DragControlsPC).previousLevel;
	if (prevLevel > 1)
	{
		numNext = prevLevel - 2;
	}
	
	//get the numbers
	numbers = GameObject.FindGameObjectsWithTag("Number");
	
	//sort the numbers
	swapped = true;
  	j = 0;
    while (swapped) 
    {
        swapped = false;
    	j++;
        for (i = 0; i < numbers.Length - j; i++) 
        {                                       
        	if (int.Parse(numbers[i].GetComponent(TextMesh).text) > int.Parse(numbers[i + 1].GetComponent(TextMesh).text)) 
        	{                          
            	dummyObj = numbers[i];
                numbers[i] = numbers[i + 1];
                numbers[i + 1] = dummyObj;
                swapped = true;
            }
		}                
    }
    
    //save the level names and time and turn off numbers and text
    for (i = 0; i < numbers.Length; i++)
    {
    	if (numbers[i] != null)
    	{
	    	//numbers[i].renderer.material.color.a = 0;
	    	//numbers[i].GetComponent(TextMesh).text = "";
	    	
	    	names.Add(numbers[i].transform.parent.Find("Name").GetComponent(TextMesh).text);
	    	//numbers[i].transform.parent.Find("Name").GetComponent(TextMesh).text = "";
	    	
	    	times.Add(numbers[i].transform.parent.Find("Time").GetComponent(TextMesh).text);
	    	//numbers[i].transform.parent.Find("Time").GetComponent(TextMesh).text = "";
	    	
	    	//numbers[i].transform.parent.transform.Find("CompletedPlane").GetComponent(TextMesh).text = "";
	    }
    }
    
    //turn off the correct level tags
    for (i = numNext; i < numbers.Length; i++)
    {
    	numbers[i].renderer.material.color.a = 0; //number material
    	numbers[i].GetComponent(TextMesh).text = ""; //turn off number
    	numbers[i].transform.parent.Find("Name").GetComponent(TextMesh).text = ""; //turn off name
    	numbers[i].transform.parent.Find("Time").GetComponent(TextMesh).text = ""; //turn off time
    	numbers[i].transform.parent.transform.Find("CompletedPlane").GetComponent(TextMesh).text = ""; //turn off completed plane
    }  
    
    //start typing the levels out
    TypeControllerIn();    
}

function Update () 
{
	
}

function TypeControllerIn()
{
	yield WaitForSeconds(0.5);
	do
	{
		if (!Running)
		{
			TypeStart(numbers[numNext], numNext+1, names[numNext], times[numNext]);
			Running = true;
			numNext++;
		}
		yield;
	}while(numNext != 20);
}

function TypeControllerAway()
{
	Running = false;
	do
	{
		if (!Running)
		{
			if (!(numNext+1 > numbers.Length))
			{
				TypeStartAway(numbers[numNext], numNext+1, names[numNext], times[numNext]);
				Running = true;
				numNext++;
			}
			else
			{
				NextLevelReady = true;
				return;
			}
		}
		yield;
	}while(numNext <= awayStart + 6);
	NextLevelReady = true;
}

function TypeStart (object : GameObject, num : int, name : String, time : String)
{
	FadeIn(object);
	yield StartCoroutine(Type(num.ToString(), object)); //type number
	yield StartCoroutine(Type(name, object.transform.parent.transform.Find("Name").gameObject)); //type level name
	yield StartCoroutine(Type(time, object.transform.parent.transform.Find("Time").gameObject)); //type the level time
	if (object.transform.parent.transform.Find("CompletedPlane").gameObject.active)
	{
		yield StartCoroutine(Type("COMPLETED", object.transform.parent.transform.Find("CompletedPlane").gameObject)); //type "completed"
	}
	Running = false;
} 

function TypeStartAway (object : GameObject, num : int, name : String, time : String)
{
	FadeOut(object);
	yield StartCoroutine(UnType(name, object.transform.parent.transform.Find("Name").gameObject, name.Length)); //type level name
	yield StartCoroutine(UnType(time, object.transform.parent.transform.Find("Time").gameObject, time.Length)); //type the level time
	if (object.transform.parent.transform.Find("CompletedPlane").gameObject.active)
	{
		yield StartCoroutine(UnType("COMPLETED", object.transform.parent.transform.Find("CompletedPlane").gameObject, "COMPLETED".Length)); //type "completed"
	}
	Running = false;
}

function Type(text : String, object : GameObject) //an effect of typing in something
{
	//var str : String;
	for (i = 0; i < text.Length; i++)
	{
		object.GetComponent(TextMesh).text = object.GetComponent(TextMesh).text + text[i];
		yield WaitForSeconds(0.01);
	}
}

function UnType(text : String, object : GameObject, length : int)
{
	for (i = 0; i < length; i++)
	{
		text = text.Substring(0, text.Length - 1);
		object.GetComponent(TextMesh).text = text;
		yield WaitForSeconds(0.01);
	}
}

function FadeIn(object : GameObject)
{
	do
	{
		object.renderer.material.color.a += 4 * Time.deltaTime;
		yield;
	} while (object.renderer.material.color.a <= 1);
}

function FadeOut(object : GameObject)
{
	do
	{
		object.renderer.material.color.a -= 4 * Time.deltaTime;
		yield;
	} while (object.renderer.material.color.a > 0);
}

function TypeAway()
{
	if (virgin)
	{
		LevelLookingAt();
		StopAllCoroutines();
		virgin = false;
		TypeControllerAway();
	}
}

function LevelLookingAt() //find which level the camera is looking at
{
	if (Physics.Raycast(Vector3(Camera.main.transform.position.x, Camera.main.transform.position.y - 3.5, Camera.main.transform.position.z), Camera.main.transform.forward * 1000, hit, 1000))
	{
		Check();
	}
	else if (Physics.Raycast(Vector3(Camera.main.transform.position.x - 3, Camera.main.transform.position.y - 3.5, Camera.main.transform.position.z), Camera.main.transform.forward * 1000, hit, 1000))
	{
		Check();
	}
	else if (Physics.Raycast(Vector3(Camera.main.transform.position.x + 3, Camera.main.transform.position.y - 3.5, Camera.main.transform.position.z), Camera.main.transform.forward * 1000, hit, 1000))
	{
		Check();
	}
}

function Check()
{
	if (hit.collider.transform.Find("Num").GetComponent(TextMesh).text != "BOSS LEVEL")
	{
		numNext = int.Parse(hit.collider.transform.Find("Num").GetComponent(TextMesh).text);
		if (numNext > 4)
		{
			numNext -= 3;
		}
		else
		{
			numNext = 0;
		}
		awayStart = numNext;
	}
	else
	{
		numNext = 18;
		awayStart = 18;
	}
}