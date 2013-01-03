import System.Xml;
import System.Xml.Serialization;

public class World
{
	@XmlAttribute("name")
	public var name : String;
}

public class Level
{
	@XmlAttribute("name")
	public var name : String;
	public var bTime : int;
	public var lProgress : boolean;
	
}
