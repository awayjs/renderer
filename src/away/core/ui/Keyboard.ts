///<reference path="../../_definitions.ts"/>
module away.ui
{
	export class Keyboard
	{
		/**
		 * Constant associated with the key code value for the A key (65).
		 */
		public static A:number /*uint*/ = 65;

		/**
		 * Constant associated with the key code value for the Alternate (Option) key  (18).
		 */
		public static ALTERNATE:number /*uint*/ = 18;

		/**
		 * Select the audio mode
		 */
		public static AUDIO:number /*uint*/ = 0x01000017;

		/**
		 * Constant associated with the key code value for the B key (66).
		 */
		public static B:number /*uint*/ = 66;

		/**
		 * Return to previous page in application
		 */
		public static BACK:number /*uint*/ = 0x01000016;

		/**
		 * Constant associated with the key code value for the ` key (192).
		 */
		public static BACKQUOTE:number /*uint*/ = 192;

		/**
		 * Constant associated with the key code value for the \ key (220).
		 */
		public static BACKSLASH:number /*uint*/ = 220;

		/**
		 * Constant associated with the key code value for the Backspace key (8).
		 */
		public static BACKSPACE:number /*uint*/ = 8;

		/**
		 * Blue function key button
		 */
		public static BLUE:number /*uint*/ = 0x01000003;

		/**
		 * Constant associated with the key code value for the C key (67).
		 */
		public static C:number /*uint*/ = 67;

		/**
		 * Constant associated with the key code value for the Caps Lock key (20).
		 */
		public static CAPS_LOCK:number /*uint*/ = 20;

		/**
		 * Channel down
		 */
		public static CHANNEL_DOWN:number /*uint*/ = 0x01000005;

		/**
		 * Channel up
		 */
		public static CHANNEL_UP:number /*uint*/ = 0x01000005;

		/**
		 * Constant associated with the key code value for the , key (188).
		 */
		public static COMMA:number /*uint*/ = 188;

		/**
		 * Constant associated with the Mac command key (15). This constant is
		 * currently only used for setting menu key equivalents.
		 */
		public static COMMAND:number /*uint*/ = 15;

		/**
		 * Constant associated with the key code value for the Control key (17).
		 */
		public static CONTROL:number /*uint*/ = 17;

		/**
		 * An array containing all the defined key name constants.
		 */
		public static CharCodeStrings:Array<any>;

		/**
		 * Constant associated with the key code value for the D key (68).
		 */
		public static D:number /*uint*/ = 68;

		/**
		 * Constant associated with the key code value for the Delete key (46).
		 */
		public static DELETE:number /*uint*/ = 46;

		/**
		 * Constant associated with the key code value for the Down Arrow key (40).
		 */
		public static DOWN:number /*uint*/ = 40;

		/**
		 * Engage DVR application mode
		 */
		public static DVR:number /*uint*/ = 0x01000019;

		/**
		 * Constant associated with the key code value for the E key (69).
		 */
		public static E:number /*uint*/ = 69;

		/**
		 * Constant associated with the key code value for the End key (35).
		 */
		public static END:number /*uint*/ = 35;

		/**
		 * Constant associated with the key code value for the Enter key (13).
		 */
		public static ENTER:number /*uint*/ = 13;

		/**
		 * Constant associated with the key code value for the = key (187).
		 */
		public static EQUAL:number /*uint*/ = 187;

		/**
		 * Constant associated with the key code value for the Escape key (27).
		 */
		public static ESCAPE:number /*uint*/ = 27;

		/**
		 * Exits current application mode
		 */
		public static EXIT:number /*uint*/ = 0x01000015;

		/**
		 * Constant associated with the key code value for the F key (70).
		 */
		public static F:number /*uint*/ = 70;

		/**
		 * Constant associated with the key code value for the F1 key (112).
		 */
		public static F1:number /*uint*/ = 112;

		/**
		 * Constant associated with the key code value for the F10 key (121).
		 */
		public static F10:number /*uint*/ = 121;

		/**
		 * Constant associated with the key code value for the F11 key (122).
		 */
		public static F11:number /*uint*/ = 122;

		/**
		 * Constant associated with the key code value for the F12 key (123).
		 */
		public static F12:number /*uint*/ = 123;

		/**
		 * Constant associated with the key code value for the F13 key (124).
		 */
		public static F13:number /*uint*/ = 124;

		/**
		 * Constant associated with the key code value for the F14 key (125).
		 */
		public static F14:number /*uint*/ = 125;

		/**
		 * Constant associated with the key code value for the F15 key (126).
		 */
		public static F15:number /*uint*/ = 126;

		/**
		 * Constant associated with the key code value for the F2 key (113).
		 */
		public static F2:number /*uint*/ = 113;

		/**
		 * Constant associated with the key code value for the F3 key (114).
		 */
		public static F3:number /*uint*/ = 114;

		/**
		 * Constant associated with the key code value for the F4 key (115).
		 */
		public static F4:number /*uint*/ = 115;

		/**
		 * Constant associated with the key code value for the F5 key (116).
		 */
		public static F5:number /*uint*/ = 116;

		/**
		 * Constant associated with the key code value for the F6 key (117).
		 */
		public static F6:number /*uint*/ = 117;

		/**
		 * Constant associated with the key code value for the F7 key (118).
		 */
		public static F7:number /*uint*/ = 118;

		/**
		 * Constant associated with the key code value for the F8 key (119).
		 */
		public static F8:number /*uint*/ = 119;

		/**
		 * Constant associated with the key code value for the F9 key (120).
		 */
		public static F9:number /*uint*/ = 120;

		/**
		 * Engage fast-forward transport mode
		 */
		public static FAST_FORWARD:number /*uint*/ = 0x0100000A;

		/**
		 * Constant associated with the key code value for the G key (71).
		 */
		public static G:number /*uint*/ = 71;

		/**
		 * Green function key button
		 */
		public static GREEN:number /*uint*/ = 0x01000001;

		/**
		 * Engage program guide
		 */
		public static GUIDE:number /*uint*/ = 0x01000014;

		/**
		 * Constant associated with the key code value for the H key (72).
		 */
		public static H:number /*uint*/ = 72;

		/**
		 * Engage help application or context-sensitive help
		 */
		public static HELP:number /*uint*/ = 0x0100001D;

		/**
		 * Constant associated with the key code value for the Home key (36).
		 */
		public static HOME:number /*uint*/ = 36;

		/**
		 * Constant associated with the key code value for the I key (73).
		 */
		public static I:number /*uint*/ = 73;

		/**
		 * Info button
		 */
		public static INFO:number /*uint*/ = 0x01000013;

		/**
		 * Cycle input
		 */
		public static INPUT:number /*uint*/ = 0x0100001B;

		/**
		 * Constant associated with the key code value for the Insert key (45).
		 */
		public static INSERT:number /*uint*/ = 45;

		/**
		 * Constant associated with the key code value for the J key (74).
		 */
		public static J:number /*uint*/ = 74;

		/**
		 * Constant associated with the key code value for the K key (75).
		 */
		public static K:number /*uint*/ = 75;

		/**
		 * The Begin key
		 */
		public static KEYNAME_BEGIN:string = "Begin";

		/**
		 * The Break key
		 */
		public static KEYNAME_BREAK:string = "Break";

		/**
		 * The Clear Display key
		 */
		public static KEYNAME_CLEARDISPLAY:string = "ClrDsp";

		/**
		 * The Clear Line key
		 */
		public static KEYNAME_CLEARLINE:string = "ClrLn";

		/**
		 * The Delete key
		 */
		public static KEYNAME_DELETE:string = "Delete";

		/**
		 * The Delete Character key
		 */
		public static KEYNAME_DELETECHAR:string = "DelChr";

		/**
		 * The Delete Line key
		 */
		public static KEYNAME_DELETELINE:string = "DelLn";

		/**
		 * The down arrow
		 */
		public static KEYNAME_DOWNARROW:string = "Down";

		/**
		 * The End key
		 */
		public static KEYNAME_END:string = "End";

		/**
		 * The Execute key
		 */
		public static KEYNAME_EXECUTE:string = "Exec";

		/**
		 * The F1 key
		 */
		public static KEYNAME_F1:string = "F1";

		/**
		 * The F10 key
		 */
		public static KEYNAME_F10:string = "F10";

		/**
		 * The F11 key
		 */
		public static KEYNAME_F11:string = "F11";

		/**
		 * The F12 key
		 */
		public static KEYNAME_F12:string = "F12";

		/**
		 * The F13 key
		 */
		public static KEYNAME_F13:string = "F13";

		/**
		 * The F14 key
		 */
		public static KEYNAME_F14:string = "F14";

		/**
		 * The F15 key
		 */
		public static KEYNAME_F15:string = "F15";

		/**
		 * The F16 key
		 */
		public static KEYNAME_F16:string = "F16";

		/**
		 * The F17 key
		 */
		public static KEYNAME_F17:string = "F17";

		/**
		 * The F18 key
		 */
		public static KEYNAME_F18:string = "F18";

		/**
		 * The F19 key
		 */
		public static KEYNAME_F19:string = "F19";

		/**
		 * The F2 key
		 */
		public static KEYNAME_F2:string = "F2";

		/**
		 * The F20 key
		 */
		public static KEYNAME_F20:string = "F20";

		/**
		 * The F21 key
		 */
		public static KEYNAME_F21:string = "F21";

		/**
		 * The F22 key
		 */
		public static KEYNAME_F22:string = "F22";

		/**
		 * The F23 key
		 */
		public static KEYNAME_F23:string = "F23";

		/**
		 * The F24 key
		 */
		public static KEYNAME_F24:string = "F24";

		/**
		 * The F25 key
		 */
		public static KEYNAME_F25:string = "F25";

		/**
		 * The F26 key
		 */
		public static KEYNAME_F26:string = "F26";

		/**
		 * The F27 key
		 */
		public static KEYNAME_F27:string = "F27";

		/**
		 * The F28 key
		 */
		public static KEYNAME_F28:string = "F28";

		/**
		 * The F29 key
		 */
		public static KEYNAME_F29:string = "F29";

		/**
		 * The F3 key
		 */
		public static KEYNAME_F3:string = "F3";

		/**
		 * The F30 key
		 */
		public static KEYNAME_F30:string = "F30";

		/**
		 * The F31 key
		 */
		public static KEYNAME_F31:string = "F31";

		/**
		 * The F32 key
		 */
		public static KEYNAME_F32:string = "F32";

		/**
		 * The F33 key
		 */
		public static KEYNAME_F33:string = "F33";

		/**
		 * The F34 key
		 */
		public static KEYNAME_F34:string = "F34";

		/**
		 * The F35 key
		 */
		public static KEYNAME_F35:string = "F35";

		/**
		 * The F4 key
		 */
		public static KEYNAME_F4:string = "F4";

		/**
		 * The F5 key
		 */
		public static KEYNAME_F5:string = "F5";

		/**
		 * The F6 key
		 */
		public static KEYNAME_F6:string = "F6";

		/**
		 * The F7 key
		 */
		public static KEYNAME_F7:string = "F7";

		/**
		 * The F8 key
		 */
		public static KEYNAME_F8:string = "F8";

		/**
		 * The F9 key
		 */
		public static KEYNAME_F9:string = "F9";

		/**
		 * The Find key
		 */
		public static KEYNAME_FIND:string = "Find";

		/**
		 * The Help key
		 */
		public static KEYNAME_HELP:string = "Help";

		/**
		 * The Home key
		 */
		public static KEYNAME_HOME:string = "Home";

		/**
		 * The Insert key
		 */
		public static KEYNAME_INSERT:string = "Insert";

		/**
		 * The Insert Character key
		 */
		public static KEYNAME_INSERTCHAR:string = "InsChr";

		/**
		 * The Insert Line key
		 */
		public static KEYNAME_INSERTLINE:string = "LnsLn";

		/**
		 * The left arrow
		 */
		public static KEYNAME_LEFTARROW:string = "Left";

		/**
		 * The Menu key
		 */
		public static KEYNAME_MENU:string = "Menu";

		/**
		 * The Mode Switch key
		 */
		public static KEYNAME_MODESWITCH:string = "ModeSw";

		/**
		 * The Next key
		 */
		public static KEYNAME_NEXT:string = "Next";

		/**
		 * The Page Down key
		 */
		public static KEYNAME_PAGEDOWN:string = "PgDn";

		/**
		 * The Page Up key
		 */
		public static KEYNAME_PAGEUP:string = "PgUp";

		/**
		 * The Pause key
		 */
		public static KEYNAME_PAUSE:string = "Pause";

		/**
		 * The Previous key
		 */
		public static KEYNAME_PREV:string = "Prev";

		/**
		 * The PRINT key
		 */
		public static KEYNAME_PRINT:string = "Print";

		/**
		 * The PRINT Screen
		 */
		public static KEYNAME_PRINTSCREEN:string = "PrntScrn";

		/**
		 * The Redo key
		 */
		public static KEYNAME_REDO:string = "Redo";

		/**
		 * The Reset key
		 */
		public static KEYNAME_RESET:string = "Reset";

		/**
		 * The right arrow
		 */
		public static KEYNAME_RIGHTARROW:string = "Right";

		/**
		 * The Scroll Lock key
		 */
		public static KEYNAME_SCROLLLOCK:string = "ScrlLck";

		/**
		 * The Select key
		 */
		public static KEYNAME_SELECT:string = "Select";

		/**
		 * The Stop key
		 */
		public static KEYNAME_STOP:string = "Stop";

		/**
		 * The System Request key
		 */
		public static KEYNAME_SYSREQ:string = "SysReq";

		/**
		 * The System key
		 */
		public static KEYNAME_SYSTEM:string = "Sys";

		/**
		 * The Undo key
		 */
		public static KEYNAME_UNDO:string = "Undo";

		/**
		 * The up arrow
		 */
		public static KEYNAME_UPARROW:string = "Up";

		/**
		 * The User key
		 */
		public static KEYNAME_USER:string = "User";

		/**
		 * Constant associated with the key code value for the L key (76).
		 */
		public static L:number /*uint*/ = 76;

		/**
		 * Watch last channel or show watched
		 */
		public static LAST:number /*uint*/ = 0x01000011;

		/**
		 * Constant associated with the key code value for the Left Arrow key (37).
		 */
		public static LEFT:number /*uint*/ = 37;

		/**
		 * Constant associated with the key code value for the [ key (219).
		 */
		public static LEFTBRACKET:number /*uint*/ = 219;

		/**
		 * Return to live [position in broadcast]
		 */
		public static LIVE:number /*uint*/ = 0x01000010;

		/**
		 * Constant associated with the key code value for the M key (77).
		 */
		public static M:number /*uint*/ = 77;

		/**
		 * Engage "Master Shell" e.g. TiVo or other vendor button
		 */
		public static MASTER_SHELL:number /*uint*/ = 0x0100001E;

		/**
		 * Engage menu
		 */
		public static MENU:number /*uint*/ = 0x01000012;

		/**
		 * Constant associated with the key code value for the - key (189).
		 */
		public static MINUS:number /*uint*/ = 189;

		/**
		 * Constant associated with the key code value for the N key (78).
		 */
		public static N:number /*uint*/ = 78;

		/**
		 * Skip to next track or chapter
		 */
		public static NEXT:number /*uint*/ = 0x0100000E;

		/**
		 * Constant associated with the key code value for the 0 key (48).
		 */
		public static NUMBER_0:number /*uint*/ = 48;

		/**
		 * Constant associated with the key code value for the 1 key (49).
		 */
		public static NUMBER_1:number /*uint*/ = 49;

		/**
		 * Constant associated with the key code value for the 2 key (50).
		 */
		public static NUMBER_2:number /*uint*/ = 50;

		/**
		 * Constant associated with the key code value for the 3 key (51).
		 */
		public static NUMBER_3:number /*uint*/ = 51;

		/**
		 * Constant associated with the key code value for the 4 key (52).
		 */
		public static NUMBER_4:number /*uint*/ = 52;

		/**
		 * Constant associated with the key code value for the 5 key (53).
		 */
		public static NUMBER_5:number /*uint*/ = 53;

		/**
		 * Constant associated with the key code value for the 6 key (54).
		 */
		public static NUMBER_6:number /*uint*/ = 54;

		/**
		 * Constant associated with the key code value for the 7 key (55).
		 */
		public static NUMBER_7:number /*uint*/ = 55;

		/**
		 * Constant associated with the key code value for the 8 key (56).
		 */
		public static NUMBER_8:number /*uint*/ = 56;

		/**
		 * Constant associated with the key code value for the 9 key (57).
		 */
		public static NUMBER_9:number /*uint*/ = 57;

		/**
		 * Constant associated with the pseudo-key code for the the number pad (21). Use to set numpad modifier on key equivalents
		 */
		public static NUMPAD:number /*uint*/ = 21;

		/**
		 * Constant associated with the key code value for the number 0 key on the number pad (96).
		 */
		public static NUMPAD_0:number /*uint*/ = 96;

		/**
		 * Constant associated with the key code value for the number 1 key on the number pad (97).
		 */
		public static NUMPAD_1:number /*uint*/ = 97;

		/**
		 * Constant associated with the key code value for the number 2 key on the number pad (98).
		 */
		public static NUMPAD_2:number /*uint*/ = 98;

		/**
		 * Constant associated with the key code value for the number 3 key on the number pad (99).
		 */
		public static NUMPAD_3:number /*uint*/ = 99;

		/**
		 * Constant associated with the key code value for the number 4 key on the number pad (100).
		 */
		public static NUMPAD_4:number /*uint*/ = 100;

		/**
		 * Constant associated with the key code value for the number 5 key on the number pad (101).
		 */
		public static NUMPAD_5:number /*uint*/ = 101;

		/**
		 * Constant associated with the key code value for the number 6 key on the number pad (102).
		 */
		public static NUMPAD_6:number /*uint*/ = 102;

		/**
		 * Constant associated with the key code value for the number 7 key on the number pad (103).
		 */
		public static NUMPAD_7:number /*uint*/ = 103;

		/**
		 * Constant associated with the key code value for the number 8 key on the number pad (104).
		 */
		public static NUMPAD_8:number /*uint*/ = 104;

		/**
		 * Constant associated with the key code value for the number 9 key on the number pad (105).
		 */
		public static NUMPAD_9:number /*uint*/ = 105;

		/**
		 * Constant associated with the key code value for the addition key on the number pad (107).
		 */
		public static NUMPAD_ADD:number /*uint*/ = 107;

		/**
		 * Constant associated with the key code value for the decimal key on the number pad (110).
		 */
		public static NUMPAD_DECIMAL:number /*uint*/ = 110;

		/**
		 * Constant associated with the key code value for the division key on the number pad (111).
		 */
		public static NUMPAD_DIVIDE:number /*uint*/ = 111;

		/**
		 * Constant associated with the key code value for the Enter key on the number pad (108).
		 */
		public static NUMPAD_ENTER:number /*uint*/ = 108;

		/**
		 * Constant associated with the key code value for the multiplication key on the number pad (106).
		 */
		public static NUMPAD_MULTIPLY:number /*uint*/ = 106;

		/**
		 * Constant associated with the key code value for the subtraction key on the number pad (109).
		 */
		public static NUMPAD_SUBTRACT:number /*uint*/ = 109;

		/**
		 * Constant associated with the key code value for the O key (79).
		 */
		public static O:number /*uint*/ = 79;

		/**
		 * Constant associated with the key code value for the P key (80).
		 */
		public static P:number /*uint*/ = 80;

		/**
		 * Constant associated with the key code value for the Page Down key (34).
		 */
		public static PAGE_DOWN:number /*uint*/ = 34;

		/**
		 * Constant associated with the key code value for the Page Up key (33).
		 */
		public static PAGE_UP:number /*uint*/ = 33;

		/**
		 * Engage pause transport mode
		 */
		public static PAUSE:number /*uint*/ = 0x01000008;

		/**
		 * Constant associated with the key code value for the . key (190).
		 */
		public static PERIOD:number /*uint*/ = 190;

		/**
		 * Engage play transport mode
		 */
		public static PLAY:number /*uint*/ = 0x01000007;

		/**
		 * Skip to previous track or chapter
		 */
		public static PREVIOUS:number /*uint*/ = 0x0100000F;

		/**
		 * Constant associated with the key code value for the Q key (81).
		 */
		public static Q:number /*uint*/ = 81;

		/**
		 * Constant associated with the key code value for the ' key (222).
		 */
		public static QUOTE:number /*uint*/ = 222;

		/**
		 * Constant associated with the key code value for the R key (82).
		 */
		public static R:number /*uint*/ = 82;

		/**
		 * Record item or engage record transport mode
		 */
		public static RECORD:number /*uint*/ = 0x01000006;

		/**
		 * Red function key button
		 */
		public static RED:number /*uint*/ = 0x01000000;

		/**
		 * Engage rewind transport mode
		 */
		public static REWIND:number /*uint*/ = 0x0100000B;

		/**
		 * Constant associated with the key code value for the Right Arrow key (39).
		 */
		public static RIGHT:number /*uint*/ = 39;

		/**
		 * Constant associated with the key code value for the ] key (221).
		 */
		public static RIGHTBRACKET:number /*uint*/ = 221;

		/**
		 * Constant associated with the key code value for the S key (83).
		 */
		public static S:number /*uint*/ = 83;

		/**
		 * Search button
		 */
		public static SEARCH:number /*uint*/ = 0x0100001F;

		/**
		 * Constant associated with the key code value for the ; key (186).
		 */
		public static SEMICOLON:number /*uint*/ = 186;

		/**
		 * Engage setup application or menu
		 */
		public static SETUP:number /*uint*/ = 0x0100001C;

		/**
		 * Constant associated with the key code value for the Shift key (16).
		 */
		public static SHIFT:number /*uint*/ = 16;

		/**
		 * Quick skip backward (usually 7-10 seconds)
		 */
		public static SKIP_BACKWARD:number /*uint*/ = 0x0100000D;

		/**
		 * Quick skip ahead (usually 30 seconds)
		 */
		public static SKIP_FORWARD:number /*uint*/ = 0x0100000C;

		/**
		 * Constant associated with the key code value for the / key (191).
		 */
		public static SLASH:number /*uint*/ = 191;

		/**
		 * Constant associated with the key code value for the Spacebar (32).
		 */
		public static SPACE:number /*uint*/ = 32;

		/**
		 * Engage stop transport mode
		 */
		public static STOP:number /*uint*/ = 0x01000009;

		/**
		 * Toggle subtitles
		 */
		public static SUBTITLE:number /*uint*/ = 0x01000018;

		/**
		 * Constant associated with the key code value for the T key (84).
		 */
		public static T:number /*uint*/ = 84;

		/**
		 * Constant associated with the key code value for the Tab key (9).
		 */
		public static TAB:number /*uint*/ = 9;

		/**
		 * Constant associated with the key code value for the U key (85).
		 */
		public static U:number /*uint*/ = 85;

		/**
		 * Constant associated with the key code value for the Up Arrow key (38).
		 */
		public static UP:number /*uint*/ = 38;

		/**
		 * Constant associated with the key code value for the V key (86).
		 */
		public static V:number /*uint*/ = 86;

		/**
		 * Engage video-on-demand
		 */
		public static VOD:number /*uint*/ = 0x0100001A;

		/**
		 * Constant associated with the key code value for the W key (87).
		 */
		public static W:number /*uint*/ = 87;

		/**
		 * Constant associated with the key code value for the X key (88).
		 */
		public static X:number /*uint*/ = 88;

		/**
		 * Constant associated with the key code value for the Y key (89).
		 */
		public static Y:number /*uint*/ = 89;

		/**
		 * Yellow function key button
		 */
		public static YELLOW:number /*uint*/ = 0x01000002;

		/**
		 * Constant associated with the key code value for the Z key (90).
		 */
		public static Z:number /*uint*/ = 90;

	}
}