Shader "Shaders/CustSelfIlluminSpec" 
{
	Properties 
	{
		_Color ("Main Color", Color) = (1,1,1,1)
		_SpecColor ("Specular Color", Color) = (0.5, 0.5, 0.5, 1)
		_Shininess ("Shininess", Range (0.01, 1)) = 0.078125
		_MainTex ("Base (RGB) Gloss (A)", 2D) = "white" {}
		_Illum ("Illumin (A)", 2D) = "white" {}
		_Ramp ("Ramp", 2D) = "white" {}
		_EmissionLM ("Emission (Lightmapper)", Float) = 0
	}
	
	SubShader
	{
		//Ztest Always
		Tags {"Queue"="Transparent+1" "RenderType"="Opaque"}	
		LOD 300
		
		CGPROGRAM
		#pragma surface surf CustomDiffuse
		
		sampler2D _MainTex;
		sampler2D _Illum;
		sampler2D _Ramp;
		fixed4 _Color;
		half _Shininess;
		
		half4 LightingCustomDiffuse(SurfaceOutput s, half3 lightDir, half3 viewDir, half atten)
		{
			//ramp lighting
			half NdotL = dot(s.Normal, lightDir);
			half diff = NdotL * 0.5 + 0.5;
			half3 ramp = tex2D(_Ramp, float2(diff)).rgb;
			
			fixed4 c;
			c.rgb = (s.Albedo * _LightColor0.rgb) * (ramp * atten * 2);
			c.a = s.Alpha + _LightColor0.a * atten;
			return c;
		}
		
		struct Input 
		{
			float2 uv_MainTex;
			float2 uv_Illum;
		};
		
		void surf (Input IN, inout SurfaceOutput o) 
		{
			fixed4 tex = tex2D(_MainTex, IN.uv_MainTex);
			fixed4 c = tex * _Color;
			o.Albedo = c.rgb;
			o.Emission = c.rgb * tex2D(_Illum, IN.uv_Illum).a;
			o.Gloss = tex.a;
			o.Alpha = c.a;
			o.Specular = _Shininess;
		}
		
		ENDCG
	}
	FallBack "Self-Illumin/Diffuse"
}
