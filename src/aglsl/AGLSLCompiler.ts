///<reference path="../away/_definitions.ts" />

module aglsl
{

	export class AGLSLCompiler
	{

		public glsl:string;

		public compile(programType:string, source:string)
		{
			var agalMiniAssembler:aglsl.assembler.AGALMiniAssembler = new aglsl.assembler.AGALMiniAssembler();
			var tokenizer:aglsl.AGALTokenizer = new aglsl.AGALTokenizer();

			var data:away.utils.ByteArray
			var concatSource:string;
			switch (programType) {
				case "vertex":
					concatSource = "part vertex 1\n" + source + "endpart";
					agalMiniAssembler.assemble(concatSource);
					data = agalMiniAssembler.r['vertex'].data;
					break;
				case "fragment":
					concatSource = "part fragment 1\n" + source + "endpart";
					agalMiniAssembler.assemble(concatSource);
					data = agalMiniAssembler.r['fragment'].data;
					break;
				default:
					throw "Unknown Context3DProgramType";
			}

			var description:aglsl.Description = tokenizer.decribeAGALByteArray(data);

			var parser:aglsl.AGLSLParser = new aglsl.AGLSLParser();
			this.glsl = parser.parse(description);

			return this.glsl;
		}
	}

}