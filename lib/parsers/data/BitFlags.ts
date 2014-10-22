/**
 *
 */
class BitFlags
{
	public static FLAG1:number = 1;
	public static FLAG2:number = 2;
	public static FLAG3:number = 4;
	public static FLAG4:number = 8;
	public static FLAG5:number = 16;
	public static FLAG6:number = 32;
	public static FLAG7:number = 64;
	public static FLAG8:number = 128;
	public static FLAG9:number = 256;
	public static FLAG10:number = 512;
	public static FLAG11:number = 1024;
	public static FLAG12:number = 2048;
	public static FLAG13:number = 4096;
	public static FLAG14:number = 8192;
	public static FLAG15:number = 16384;
	public static FLAG16:number = 32768;

	public static test(flags:number, testFlag:number):boolean
	{
		return (flags & testFlag) == testFlag;
	}
}

export = BitFlags;