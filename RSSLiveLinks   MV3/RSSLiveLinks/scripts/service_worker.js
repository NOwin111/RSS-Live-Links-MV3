// XML解析库（内联）

// =========================================================================
//
// tinyxmlsax.js - an XML SAX parser in JavaScript compressed for downloading
//
// version 3.1
//
// =========================================================================
//
// Copyright (C) 2000 - 2002, 2003 Michael Houghton (mike@idle.org), Raymond Irving and David Joham (djoham@yahoo.com)
//
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.

// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.

// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//
// Visit the XML for <SCRIPT> home page at http://xmljs.sourceforge.net
//


var whitespace = "\n\r\t "; XMLP = function(strXML) { strXML = SAXStrings.replace(strXML, null, null, "\r\n", "\n"); strXML = SAXStrings.replace(strXML, null, null, "\r", "\n"); this.m_xml = strXML; this.m_iP = 0; this.m_iState = XMLP._STATE_PROLOG; this.m_stack = new Stack(); this._clearAttributes();}
XMLP._NONE = 0; XMLP._ELM_B = 1; XMLP._ELM_E = 2; XMLP._ELM_EMP = 3; XMLP._ATT = 4; XMLP._TEXT = 5; XMLP._ENTITY = 6; XMLP._PI = 7; XMLP._CDATA = 8; XMLP._COMMENT = 9; XMLP._DTD = 10; XMLP._ERROR = 11; XMLP._CONT_XML = 0; XMLP._CONT_ALT = 1; XMLP._ATT_NAME = 0; XMLP._ATT_VAL = 1; XMLP._STATE_PROLOG = 1; XMLP._STATE_DOCUMENT = 2; XMLP._STATE_MISC = 3; XMLP._errs = new Array(); XMLP._errs[XMLP.ERR_CLOSE_PI = 0 ] = "PI: missing closing sequence"; XMLP._errs[XMLP.ERR_CLOSE_DTD = 1 ] = "DTD: missing closing sequence"; XMLP._errs[XMLP.ERR_CLOSE_COMMENT = 2 ] = "Comment: missing closing sequence"; XMLP._errs[XMLP.ERR_CLOSE_CDATA = 3 ] = "CDATA: missing closing sequence"; XMLP._errs[XMLP.ERR_CLOSE_ELM = 4 ] = "Element: missing closing sequence"; XMLP._errs[XMLP.ERR_CLOSE_ENTITY = 5 ] = "Entity: missing closing sequence"; XMLP._errs[XMLP.ERR_PI_TARGET = 6 ] = "PI: target is required"; XMLP._errs[XMLP.ERR_ELM_EMPTY = 7 ] = "Element: cannot be both empty and closing"; XMLP._errs[XMLP.ERR_ELM_NAME = 8 ] = "Element: name must immediatly follow \"<\""; XMLP._errs[XMLP.ERR_ELM_LT_NAME = 9 ] = "Element: \"<\" not allowed in element names"; XMLP._errs[XMLP.ERR_ATT_VALUES = 10] = "Attribute: values are required and must be in quotes"; XMLP._errs[XMLP.ERR_ATT_LT_NAME = 11] = "Element: \"<\" not allowed in attribute names"; XMLP._errs[XMLP.ERR_ATT_LT_VALUE = 12] = "Attribute: \"<\" not allowed in attribute values"; XMLP._errs[XMLP.ERR_ATT_DUP = 13] = "Attribute: duplicate attributes not allowed"; XMLP._errs[XMLP.ERR_ENTITY_UNKNOWN = 14] = "Entity: unknown entity"; XMLP._errs[XMLP.ERR_INFINITELOOP = 15] = "Infininte loop"; XMLP._errs[XMLP.ERR_DOC_STRUCTURE = 16] = "Document: only comments, processing instructions, or whitespace allowed outside of document element"; XMLP._errs[XMLP.ERR_ELM_NESTING = 17] = "Element: must be nested correctly"; XMLP.prototype._addAttribute = function(name, value) { this.m_atts[this.m_atts.length] = new Array(name, value);}
XMLP.prototype._checkStructure = function(iEvent) { if(XMLP._STATE_PROLOG == this.m_iState) { if((XMLP._TEXT == iEvent) || (XMLP._ENTITY == iEvent)) { if(SAXStrings.indexOfNonWhitespace(this.getContent(), this.getContentBegin(), this.getContentEnd()) != -1) { return this._setErr(XMLP.ERR_DOC_STRUCTURE);}
}
if((XMLP._ELM_B == iEvent) || (XMLP._ELM_EMP == iEvent)) { this.m_iState = XMLP._STATE_DOCUMENT;}
}
if(XMLP._STATE_DOCUMENT == this.m_iState) { if((XMLP._ELM_B == iEvent) || (XMLP._ELM_EMP == iEvent)) { this.m_stack.push(this.getName());}
if((XMLP._ELM_E == iEvent) || (XMLP._ELM_EMP == iEvent)) { var strTop = this.m_stack.pop(); if((strTop == null) || (strTop != this.getName())) { return this._setErr(XMLP.ERR_ELM_NESTING);}
}
if(this.m_stack.count() == 0) { this.m_iState = XMLP._STATE_MISC; return iEvent;}
}
if(XMLP._STATE_MISC == this.m_iState) { if((XMLP._ELM_B == iEvent) || (XMLP._ELM_E == iEvent) || (XMLP._ELM_EMP == iEvent) || (XMLP.EVT_DTD == iEvent)) { return this._setErr(XMLP.ERR_DOC_STRUCTURE);}
if((XMLP._TEXT == iEvent) || (XMLP._ENTITY == iEvent)) { if(SAXStrings.indexOfNonWhitespace(this.getContent(), this.getContentBegin(), this.getContentEnd()) != -1) { return this._setErr(XMLP.ERR_DOC_STRUCTURE);}
}
}
return iEvent;}
XMLP.prototype._clearAttributes = function() { this.m_atts = new Array();}
XMLP.prototype._findAttributeIndex = function(name) { for(var i = 0; i < this.m_atts.length; i++) { if(this.m_atts[i][XMLP._ATT_NAME] == name) { return i;}
}
return -1;}
XMLP.prototype.getAttributeCount = function() { return this.m_atts ? this.m_atts.length : 0;}
XMLP.prototype.getAttributeName = function(index) { return ((index < 0) || (index >= this.m_atts.length)) ? null : this.m_atts[index][XMLP._ATT_NAME];}
XMLP.prototype.getAttributeValue = function(index) { return ((index < 0) || (index >= this.m_atts.length)) ? null : __unescapeString(this.m_atts[index][XMLP._ATT_VAL]);}
XMLP.prototype.getAttributeValueByName = function(name) { return this.getAttributeValue(this._findAttributeIndex(name));}
XMLP.prototype.getColumnNumber = function() { return SAXStrings.getColumnNumber(this.m_xml, this.m_iP);}
XMLP.prototype.getContent = function() { return (this.m_cSrc == XMLP._CONT_XML) ? this.m_xml : this.m_cAlt;}
XMLP.prototype.getContentBegin = function() { return this.m_cB;}
XMLP.prototype.getContentEnd = function() { return this.m_cE;}
XMLP.prototype.getLineNumber = function() { return SAXStrings.getLineNumber(this.m_xml, this.m_iP);}
XMLP.prototype.getName = function() { return this.m_name;}
XMLP.prototype.next = function() { return this._checkStructure(this._parse());}
XMLP.prototype._parse = function() { if(this.m_iP == this.m_xml.length) { return XMLP._NONE;}
if(this.m_iP == this.m_xml.indexOf("<?", this.m_iP)) { return this._parsePI (this.m_iP + 2);}
else if(this.m_iP == this.m_xml.indexOf("<!DOCTYPE", this.m_iP)) { return this._parseDTD (this.m_iP + 9);}
else if(this.m_iP == this.m_xml.indexOf("<!--", this.m_iP)) { return this._parseComment(this.m_iP + 4);}
else if(this.m_iP == this.m_xml.indexOf("<![CDATA[", this.m_iP)) { return this._parseCDATA (this.m_iP + 9);}
else if(this.m_iP == this.m_xml.indexOf("<", this.m_iP)) { return this._parseElement(this.m_iP + 1);}
else if(this.m_iP == this.m_xml.indexOf("&", this.m_iP)) { return this._parseEntity (this.m_iP + 1);}
else{ return this._parseText (this.m_iP);}
}
XMLP.prototype._parseAttribute = function(iB, iE) { var iNB, iNE, iEq, iVB, iVE; var cQuote, strN, strV; this.m_cAlt = ""; iNB = SAXStrings.indexOfNonWhitespace(this.m_xml, iB, iE); if((iNB == -1) ||(iNB >= iE)) { return iNB;}
iEq = this.m_xml.indexOf("=", iNB); if((iEq == -1) || (iEq > iE)) { return this._setErr(XMLP.ERR_ATT_VALUES);}
iNE = SAXStrings.lastIndexOfNonWhitespace(this.m_xml, iNB, iEq); iVB = SAXStrings.indexOfNonWhitespace(this.m_xml, iEq + 1, iE); if((iVB == -1) ||(iVB > iE)) { return this._setErr(XMLP.ERR_ATT_VALUES);}
cQuote = this.m_xml.charAt(iVB); if(SAXStrings.QUOTES.indexOf(cQuote) == -1) { return this._setErr(XMLP.ERR_ATT_VALUES);}
iVE = this.m_xml.indexOf(cQuote, iVB + 1); if((iVE == -1) ||(iVE > iE)) { return this._setErr(XMLP.ERR_ATT_VALUES);}
strN = this.m_xml.substring(iNB, iNE + 1); strV = this.m_xml.substring(iVB + 1, iVE); if(strN.indexOf("<") != -1) { return this._setErr(XMLP.ERR_ATT_LT_NAME);}
if(strV.indexOf("<") != -1) { return this._setErr(XMLP.ERR_ATT_LT_VALUE);}
strV = SAXStrings.replace(strV, null, null, "\n", " "); strV = SAXStrings.replace(strV, null, null, "\t", " "); iRet = this._replaceEntities(strV); if(iRet == XMLP._ERROR) { return iRet;}
strV = this.m_cAlt; if(this._findAttributeIndex(strN) == -1) { this._addAttribute(strN, strV);}
else { return this._setErr(XMLP.ERR_ATT_DUP);}
this.m_iP = iVE + 2; return XMLP._ATT;}
XMLP.prototype._parseCDATA = function(iB) { var iE = this.m_xml.indexOf("]]>", iB); if (iE == -1) { return this._setErr(XMLP.ERR_CLOSE_CDATA);}
this._setContent(XMLP._CONT_XML, iB, iE); this.m_iP = iE + 3; return XMLP._CDATA;}
XMLP.prototype._parseComment = function(iB) { var iE = this.m_xml.indexOf("-" + "->", iB); if (iE == -1) { return this._setErr(XMLP.ERR_CLOSE_COMMENT);}
this._setContent(XMLP._CONT_XML, iB, iE); this.m_iP = iE + 3; return XMLP._COMMENT;}
XMLP.prototype._parseDTD = function(iB) { var iE, strClose, iInt, iLast; iE = this.m_xml.indexOf(">", iB); if(iE == -1) { return this._setErr(XMLP.ERR_CLOSE_DTD);}
iInt = this.m_xml.indexOf("[", iB); strClose = ((iInt != -1) && (iInt < iE)) ? "]>" : ">"; while(true) { if(iE == iLast) { return this._setErr(XMLP.ERR_INFINITELOOP);}
iLast = iE; iE = this.m_xml.indexOf(strClose, iB); if(iE == -1) { return this._setErr(XMLP.ERR_CLOSE_DTD);}
if (this.m_xml.substring(iE - 1, iE + 2) != "]]>") { break;}
}
this.m_iP = iE + strClose.length; return XMLP._DTD;}
XMLP.prototype._parseElement = function(iB) { var iE, iDE, iNE, iRet; var iType, strN, iLast; iDE = iE = this.m_xml.indexOf(">", iB); if(iE == -1) { return this._setErr(XMLP.ERR_CLOSE_ELM);}
if(this.m_xml.charAt(iB) == "/") { iType = XMLP._ELM_E; iB++;} else { iType = XMLP._ELM_B;}
if(this.m_xml.charAt(iE - 1) == "/") { if(iType == XMLP._ELM_E) { return this._setErr(XMLP.ERR_ELM_EMPTY);}
iType = XMLP._ELM_EMP; iDE--;}
iDE = SAXStrings.lastIndexOfNonWhitespace(this.m_xml, iB, iDE); if (iE - iB != 1 ) { if(SAXStrings.indexOfNonWhitespace(this.m_xml, iB, iDE) != iB) { return this._setErr(XMLP.ERR_ELM_NAME);}
}
this._clearAttributes(); iNE = SAXStrings.indexOfWhitespace(this.m_xml, iB, iDE); if(iNE == -1) { iNE = iDE + 1;}
else { this.m_iP = iNE; while(this.m_iP < iDE) { if(this.m_iP == iLast) return this._setErr(XMLP.ERR_INFINITELOOP); iLast = this.m_iP; iRet = this._parseAttribute(this.m_iP, iDE); if(iRet == XMLP._ERROR) return iRet;}
}
strN = this.m_xml.substring(iB, iNE); if(strN.indexOf("<") != -1) { return this._setErr(XMLP.ERR_ELM_LT_NAME);}
this.m_name = strN; this.m_iP = iE + 1; return iType;}
XMLP.prototype._parseEntity = function(iB) { var iE = this.m_xml.indexOf(";", iB); if(iE == -1) { return this._setErr(XMLP.ERR_CLOSE_ENTITY);}
this.m_iP = iE + 1; return this._replaceEntity(this.m_xml, iB, iE);}
XMLP.prototype._parsePI = function(iB) { var iE, iTB, iTE, iCB, iCE; iE = this.m_xml.indexOf("?>", iB); if(iE == -1) { return this._setErr(XMLP.ERR_CLOSE_PI);}
iTB = SAXStrings.indexOfNonWhitespace(this.m_xml, iB, iE); if(iTB == -1) { return this._setErr(XMLP.ERR_PI_TARGET);}
iTE = SAXStrings.indexOfWhitespace(this.m_xml, iTB, iE); if(iTE == -1) { iTE = iE;}
iCB = SAXStrings.indexOfNonWhitespace(this.m_xml, iTE, iE); if(iCB == -1) { iCB = iE;}
iCE = SAXStrings.lastIndexOfNonWhitespace(this.m_xml, iCB, iE); if(iCE == -1) { iCE = iE - 1;}
this.m_name = this.m_xml.substring(iTB, iTE); this._setContent(XMLP._CONT_XML, iCB, iCE + 1); this.m_iP = iE + 2; return XMLP._PI;}
XMLP.prototype._parseText = function(iB) { var iE, iEE; iE = this.m_xml.indexOf("<", iB); if(iE == -1) { iE = this.m_xml.length;}
iEE = this.m_xml.indexOf("&", iB); if((iEE != -1) && (iEE <= iE)) { iE = iEE;}
this._setContent(XMLP._CONT_XML, iB, iE); this.m_iP = iE; return XMLP._TEXT;}
XMLP.prototype._replaceEntities = function(strD, iB, iE) { if(SAXStrings.isEmpty(strD)) return ""; iB = iB || 0; iE = iE || strD.length; var iEB, iEE, strRet = ""; iEB = strD.indexOf("&", iB); iEE = iB; while((iEB > 0) && (iEB < iE)) { strRet += strD.substring(iEE, iEB); iEE = strD.indexOf(";", iEB) + 1; if((iEE == 0) || (iEE > iE)) { return this._setErr(XMLP.ERR_CLOSE_ENTITY);}
iRet = this._replaceEntity(strD, iEB + 1, iEE - 1); if(iRet == XMLP._ERROR) { return iRet;}
strRet += this.m_cAlt; iEB = strD.indexOf("&", iEE);}
if(iEE != iE) { strRet += strD.substring(iEE, iE);}
this._setContent(XMLP._CONT_ALT, strRet); return XMLP._ENTITY;}
XMLP.prototype._replaceEntity = function(strD, iB, iE) { if(SAXStrings.isEmpty(strD)) return -1; iB = iB || 0; iE = iE || strD.length; switch(strD.substring(iB, iE)) { case "amp": strEnt = "&"; break; case "lt": strEnt = "<"; break; case "gt": strEnt = ">"; break; case "apos": strEnt = "'"; break; case "quot": strEnt = "\""; break; default:
if(strD.charAt(iB) == "#") { strEnt = String.fromCharCode(parseInt(strD.substring(iB + 1, iE)));} else { return this._setErr(XMLP.ERR_ENTITY_UNKNOWN);}
break;}
this._setContent(XMLP._CONT_ALT, strEnt); return XMLP._ENTITY;}
XMLP.prototype._setContent = function(iSrc) { var args = arguments; if(XMLP._CONT_XML == iSrc) { this.m_cAlt = null; this.m_cB = args[1]; this.m_cE = args[2];} else { this.m_cAlt = args[1]; this.m_cB = 0; this.m_cE = args[1].length;}
this.m_cSrc = iSrc;}
XMLP.prototype._setErr = function(iErr) { var strErr = XMLP._errs[iErr]; this.m_cAlt = strErr; this.m_cB = 0; this.m_cE = strErr.length; this.m_cSrc = XMLP._CONT_ALT; return XMLP._ERROR;}
SAXDriver = function() { this.m_hndDoc = null; this.m_hndErr = null; this.m_hndLex = null;}
SAXDriver.DOC_B = 1; SAXDriver.DOC_E = 2; SAXDriver.ELM_B = 3; SAXDriver.ELM_E = 4; SAXDriver.CHARS = 5; SAXDriver.PI = 6; SAXDriver.CD_B = 7; SAXDriver.CD_E = 8; SAXDriver.CMNT = 9; SAXDriver.DTD_B = 10; SAXDriver.DTD_E = 11; SAXDriver.prototype.parse = function(strD) { var parser = new XMLP(strD); if(this.m_hndDoc && this.m_hndDoc.setDocumentLocator) { this.m_hndDoc.setDocumentLocator(this);}
this.m_parser = parser; this.m_bErr = false; if(!this.m_bErr) { this._fireEvent(SAXDriver.DOC_B);}
this._parseLoop(); if(!this.m_bErr) { this._fireEvent(SAXDriver.DOC_E);}
this.m_xml = null; this.m_iP = 0;}
SAXDriver.prototype.setDocumentHandler = function(hnd) { this.m_hndDoc = hnd;}
SAXDriver.prototype.setErrorHandler = function(hnd) { this.m_hndErr = hnd;}
SAXDriver.prototype.setLexicalHandler = function(hnd) { this.m_hndLex = hnd;}
SAXDriver.prototype.getColumnNumber = function() { return this.m_parser.getColumnNumber();}
SAXDriver.prototype.getLineNumber = function() { return this.m_parser.getLineNumber();}
SAXDriver.prototype.getMessage = function() { return this.m_strErrMsg;}
SAXDriver.prototype.getPublicId = function() { return null;}
SAXDriver.prototype.getSystemId = function() { return null;}
SAXDriver.prototype.getLength = function() { return this.m_parser.getAttributeCount();}
SAXDriver.prototype.getName = function(index) { return this.m_parser.getAttributeName(index);}
SAXDriver.prototype.getValue = function(index) { return this.m_parser.getAttributeValue(index);}
SAXDriver.prototype.getValueByName = function(name) { return this.m_parser.getAttributeValueByName(name);}
SAXDriver.prototype._fireError = function(strMsg) { this.m_strErrMsg = strMsg; this.m_bErr = true; if(this.m_hndErr && this.m_hndErr.fatalError) { this.m_hndErr.fatalError(this);}
}
SAXDriver.prototype._fireEvent = function(iEvt) { var hnd, func, args = arguments, iLen = args.length - 1; if(this.m_bErr) return; if(SAXDriver.DOC_B == iEvt) { func = "startDocument"; hnd = this.m_hndDoc;}
else if (SAXDriver.DOC_E == iEvt) { func = "endDocument"; hnd = this.m_hndDoc;}
else if (SAXDriver.ELM_B == iEvt) { func = "startElement"; hnd = this.m_hndDoc;}
else if (SAXDriver.ELM_E == iEvt) { func = "endElement"; hnd = this.m_hndDoc;}
else if (SAXDriver.CHARS == iEvt) { func = "characters"; hnd = this.m_hndDoc;}
else if (SAXDriver.PI == iEvt) { func = "processingInstruction"; hnd = this.m_hndDoc;}
else if (SAXDriver.CD_B == iEvt) { func = "startCDATA"; hnd = this.m_hndLex;}
else if (SAXDriver.CD_E == iEvt) { func = "endCDATA"; hnd = this.m_hndLex;}
else if (SAXDriver.CMNT == iEvt) { func = "comment"; hnd = this.m_hndLex;}
if(hnd && hnd[func]) { if(0 == iLen) { hnd[func]();}
else if (1 == iLen) { hnd[func](args[1]);}
else if (2 == iLen) { hnd[func](args[1], args[2]);}
else if (3 == iLen) { hnd[func](args[1], args[2], args[3]);}
}
}
SAXDriver.prototype._parseLoop = function(parser) { var iEvent, parser; parser = this.m_parser; while(!this.m_bErr) { iEvent = parser.next(); if(iEvent == XMLP._ELM_B) { this._fireEvent(SAXDriver.ELM_B, parser.getName(), this);}
else if(iEvent == XMLP._ELM_E) { this._fireEvent(SAXDriver.ELM_E, parser.getName());}
else if(iEvent == XMLP._ELM_EMP) { this._fireEvent(SAXDriver.ELM_B, parser.getName(), this); this._fireEvent(SAXDriver.ELM_E, parser.getName());}
else if(iEvent == XMLP._TEXT) { this._fireEvent(SAXDriver.CHARS, parser.getContent(), parser.getContentBegin(), parser.getContentEnd() - parser.getContentBegin());}
else if(iEvent == XMLP._ENTITY) { this._fireEvent(SAXDriver.CHARS, parser.getContent(), parser.getContentBegin(), parser.getContentEnd() - parser.getContentBegin());}
else if(iEvent == XMLP._PI) { this._fireEvent(SAXDriver.PI, parser.getName(), parser.getContent().substring(parser.getContentBegin(), parser.getContentEnd()));}
else if(iEvent == XMLP._CDATA) { this._fireEvent(SAXDriver.CD_B); this._fireEvent(SAXDriver.CHARS, parser.getContent(), parser.getContentBegin(), parser.getContentEnd() - parser.getContentBegin()); this._fireEvent(SAXDriver.CD_E);}
else if(iEvent == XMLP._COMMENT) { this._fireEvent(SAXDriver.CMNT, parser.getContent(), parser.getContentBegin(), parser.getContentEnd() - parser.getContentBegin());}
else if(iEvent == XMLP._DTD) { }
else if(iEvent == XMLP._ERROR) { this._fireError(parser.getContent());}
else if(iEvent == XMLP._NONE) { return;}
}
}
SAXStrings = function() { }
SAXStrings.WHITESPACE = " \t\n\r"; SAXStrings.QUOTES = "\"'"; SAXStrings.getColumnNumber = function(strD, iP) { if(SAXStrings.isEmpty(strD)) { return -1;}
iP = iP || strD.length; var arrD = strD.substring(0, iP).split("\n"); var strLine = arrD[arrD.length - 1]; arrD.length--; var iLinePos = arrD.join("\n").length; return iP - iLinePos;}
SAXStrings.getLineNumber = function(strD, iP) { if(SAXStrings.isEmpty(strD)) { return -1;}
iP = iP || strD.length; return strD.substring(0, iP).split("\n").length
}
SAXStrings.indexOfNonWhitespace = function(strD, iB, iE) { if(SAXStrings.isEmpty(strD)) { return -1;}
iB = iB || 0; iE = iE || strD.length; for(var i = iB; i < iE; i++){ if(SAXStrings.WHITESPACE.indexOf(strD.charAt(i)) == -1) { return i;}
}
return -1;}
SAXStrings.indexOfWhitespace = function(strD, iB, iE) { if(SAXStrings.isEmpty(strD)) { return -1;}
iB = iB || 0; iE = iE || strD.length; for(var i = iB; i < iE; i++) { if(SAXStrings.WHITESPACE.indexOf(strD.charAt(i)) != -1) { return i;}
}
return -1;}
SAXStrings.isEmpty = function(strD) { return (strD == null) || (strD.length == 0);}
SAXStrings.lastIndexOfNonWhitespace = function(strD, iB, iE) { if(SAXStrings.isEmpty(strD)) { return -1;}
iB = iB || 0; iE = iE || strD.length; for(var i = iE - 1; i >= iB; i--){ if(SAXStrings.WHITESPACE.indexOf(strD.charAt(i)) == -1){ return i;}
}
return -1;}
SAXStrings.replace = function(strD, iB, iE, strF, strR) { if(SAXStrings.isEmpty(strD)) { return "";}
iB = iB || 0; iE = iE || strD.length; return strD.substring(iB, iE).split(strF).join(strR);}
Stack = function() { this.m_arr = new Array();}
Stack.prototype.clear = function() { this.m_arr = new Array();}
Stack.prototype.count = function() { return this.m_arr.length;}
Stack.prototype.destroy = function() { this.m_arr = null;}
Stack.prototype.peek = function() { if(this.m_arr.length == 0) { return null;}
return this.m_arr[this.m_arr.length - 1];}
Stack.prototype.pop = function() { if(this.m_arr.length == 0) { return null;}
var o = this.m_arr[this.m_arr.length - 1]; this.m_arr.length--; return o;}
Stack.prototype.push = function(o) { this.m_arr[this.m_arr.length] = o;}
function isEmpty(str) { return (str==null) || (str.length==0);}
function trim(trimString, leftTrim, rightTrim) { if (isEmpty(trimString)) { return "";}
if (leftTrim == null) { leftTrim = true;}
if (rightTrim == null) { rightTrim = true;}
var left=0; var right=0; var i=0; var k=0; if (leftTrim == true) { while ((i<trimString.length) && (whitespace.indexOf(trimString.charAt(i++))!=-1)) { left++;}
}
if (rightTrim == true) { k=trimString.length-1; while((k>=left) && (whitespace.indexOf(trimString.charAt(k--))!=-1)) { right++;}
}
return trimString.substring(left, trimString.length - right);}
function __escapeString(str) { var escAmpRegEx = /&/g; var escLtRegEx = /</g; var escGtRegEx = />/g; var quotRegEx = /"/g;
    var aposRegEx = /'/g;

    str = str.replace(escAmpRegEx, "&amp;");
    str = str.replace(escLtRegEx, "&lt;");
    str = str.replace(escGtRegEx, "&gt;");
    str = str.replace(quotRegEx, "&quot;");
    str = str.replace(aposRegEx, "&apos;");

  return str;
}

/**
 * function __unescapeString 
 *
 * author: David Joham djoham@yahoo.com
 *
 * @param  str : string - The string to be unescaped
 *
 * @return : string - The unescaped string
 */
function __unescapeString(str) {

    var escAmpRegEx = /&amp;/g;
    var escLtRegEx = /&lt;/g;
    var escGtRegEx = /&gt;/g;
    var quotRegEx = /&quot;/g;
    var aposRegEx = /&apos;/g;

    str = str.replace(escAmpRegEx, "&");
    str = str.replace(escLtRegEx, "<");
    str = str.replace(escGtRegEx, ">");
    str = str.replace(quotRegEx, "\"");
    str = str.replace(aposRegEx, "'");
  return str;
}


// =========================================================================
//
// tinyxmlw3cdom.js - a W3C compliant DOM parser for XML for <SCRIPT> (compressed)
//
// version 3.1
//
// =========================================================================
//
// Copyright (C) 2002, 2003, 2004 Jon van Noort (jon@webarcana.com.au), David Joham (djoham@yahoo.com) and Scott Severtson
//
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.

// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.

// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//
// visit the XML for <SCRIPT> home page at xmljs.sourceforge.net
//
// Contains text (used within comments to methods) from the
//  XML Path Language (XPath) Version 1.0 W3C Recommendation
//  Copyright © 16 November 1999 World Wide Web Consortium,
//  (Massachusetts Institute of Technology,
//  European Research Consortium for Informatics and Mathematics, Keio University).
//  All Rights Reserved.
//  (see: http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/)

function addClass(classCollectionStr, newClass) { if (classCollectionStr) { if (classCollectionStr.indexOf("|"+ newClass +"|") < 0) { classCollectionStr += newClass + "|";}
}
else { classCollectionStr = "|"+ newClass + "|";}
return classCollectionStr;}
DOMException = function(code) { this._class = addClass(this._class, "DOMException"); this.code = code;}; DOMException.INDEX_SIZE_ERR = 1; DOMException.DOMSTRING_SIZE_ERR = 2; DOMException.HIERARCHY_REQUEST_ERR = 3; DOMException.WRONG_DOCUMENT_ERR = 4; DOMException.INVALID_CHARACTER_ERR = 5; DOMException.NO_DATA_ALLOWED_ERR = 6; DOMException.NO_MODIFICATION_ALLOWED_ERR = 7; DOMException.NOT_FOUND_ERR = 8; DOMException.NOT_SUPPORTED_ERR = 9; DOMException.INUSE_ATTRIBUTE_ERR = 10; DOMException.INVALID_STATE_ERR = 11; DOMException.SYNTAX_ERR = 12; DOMException.INVALID_MODIFICATION_ERR = 13; DOMException.NAMESPACE_ERR = 14; DOMException.INVALID_ACCESS_ERR = 15; DOMImplementation = function() { this._class = addClass(this._class, "DOMImplementation"); this._p = null; this.preserveWhiteSpace = false; this.namespaceAware = true; this.errorChecking = true;}; DOMImplementation.prototype.escapeString = function DOMNode__escapeString(str) { return __escapeString(str);}; DOMImplementation.prototype.unescapeString = function DOMNode__unescapeString(str) { return __unescapeString(str);}; DOMImplementation.prototype.hasFeature = function DOMImplementation_hasFeature(feature, version) { var ret = false; if (feature.toLowerCase() == "xml") { ret = (!version || (version == "1.0") || (version == "2.0"));}
else if (feature.toLowerCase() == "core") { ret = (!version || (version == "2.0"));}
return ret;}; DOMImplementation.prototype.loadXML = function DOMImplementation_loadXML(xmlStr) { var parser; try { parser = new XMLP(xmlStr);}
catch (e) { alert("Error Creating the SAX Parser. Did you include xmlsax.js or tinyxmlsax.js in your web page?\nThe SAX parser is needed to populate XML for <SCRIPT>'s W3C DOM Parser with data.");}
var doc = new DOMDocument(this); this._parseLoop(doc, parser); doc._parseComplete = true; return doc;}; DOMImplementation.prototype.translateErrCode = function DOMImplementation_translateErrCode(code) { var msg = ""; switch (code) { case DOMException.INDEX_SIZE_ERR :
msg = "INDEX_SIZE_ERR: Index out of bounds"; break; case DOMException.DOMSTRING_SIZE_ERR :
msg = "DOMSTRING_SIZE_ERR: The resulting string is too long to fit in a DOMString"; break; case DOMException.HIERARCHY_REQUEST_ERR :
msg = "HIERARCHY_REQUEST_ERR: The Node can not be inserted at this location"; break; case DOMException.WRONG_DOCUMENT_ERR :
msg = "WRONG_DOCUMENT_ERR: The source and the destination Documents are not the same"; break; case DOMException.INVALID_CHARACTER_ERR :
msg = "INVALID_CHARACTER_ERR: The string contains an invalid character"; break; case DOMException.NO_DATA_ALLOWED_ERR :
msg = "NO_DATA_ALLOWED_ERR: This Node / NodeList does not support data"; break; case DOMException.NO_MODIFICATION_ALLOWED_ERR :
msg = "NO_MODIFICATION_ALLOWED_ERR: This object cannot be modified"; break; case DOMException.NOT_FOUND_ERR :
msg = "NOT_FOUND_ERR: The item cannot be found"; break; case DOMException.NOT_SUPPORTED_ERR :
msg = "NOT_SUPPORTED_ERR: This implementation does not support function"; break; case DOMException.INUSE_ATTRIBUTE_ERR :
msg = "INUSE_ATTRIBUTE_ERR: The Attribute has already been assigned to another Element"; break; case DOMException.INVALID_STATE_ERR :
msg = "INVALID_STATE_ERR: The object is no longer usable"; break; case DOMException.SYNTAX_ERR :
msg = "SYNTAX_ERR: Syntax error"; break; case DOMException.INVALID_MODIFICATION_ERR :
msg = "INVALID_MODIFICATION_ERR: Cannot change the type of the object"; break; case DOMException.NAMESPACE_ERR :
msg = "NAMESPACE_ERR: The namespace declaration is incorrect"; break; case DOMException.INVALID_ACCESS_ERR :
msg = "INVALID_ACCESS_ERR: The object does not support this function"; break; default :
msg = "UNKNOWN: Unknown Exception Code ("+ code +")";}
return msg;}
DOMImplementation.prototype._parseLoop = function DOMImplementation__parseLoop(doc, p) { var iEvt, iNode, iAttr, strName; iNodeParent = doc; var el_close_count = 0; var entitiesList = new Array(); var textNodesList = new Array(); if (this.namespaceAware) { var iNS = doc.createNamespace(""); iNS.setValue("http://www.w3.org/2000/xmlns/"); doc._namespaces.setNamedItem(iNS);}
while(true) { iEvt = p.next(); if (iEvt == XMLP._ELM_B) { var pName = p.getName(); pName = trim(pName, true, true); if (!this.namespaceAware) { iNode = doc.createElement(p.getName()); for(var i = 0; i < p.getAttributeCount(); i++) { strName = p.getAttributeName(i); iAttr = iNode.getAttributeNode(strName); if(!iAttr) { iAttr = doc.createAttribute(strName);}
iAttr.setValue(p.getAttributeValue(i)); iNode.setAttributeNode(iAttr);}
}
else { iNode = doc.createElementNS("", p.getName()); iNode._namespaces = iNodeParent._namespaces._cloneNodes(iNode); for(var i = 0; i < p.getAttributeCount(); i++) { strName = p.getAttributeName(i); if (this._isNamespaceDeclaration(strName)) { var namespaceDec = this._parseNSName(strName); if (strName != "xmlns") { iNS = doc.createNamespace(strName);}
else { iNS = doc.createNamespace("");}
iNS.setValue(p.getAttributeValue(i)); iNode._namespaces.setNamedItem(iNS);}
else { iAttr = iNode.getAttributeNode(strName); if(!iAttr) { iAttr = doc.createAttributeNS("", strName);}
iAttr.setValue(p.getAttributeValue(i)); iNode.setAttributeNodeNS(iAttr); if (this._isIdDeclaration(strName)) { iNode.id = p.getAttributeValue(i);}
}
}
if (iNode._namespaces.getNamedItem(iNode.prefix)) { iNode.namespaceURI = iNode._namespaces.getNamedItem(iNode.prefix).value;}
for (var i = 0; i < iNode.attributes.length; i++) { if (iNode.attributes.item(i).prefix != "") { if (iNode._namespaces.getNamedItem(iNode.attributes.item(i).prefix)) { iNode.attributes.item(i).namespaceURI = iNode._namespaces.getNamedItem(iNode.attributes.item(i).prefix).value;}
}
}
}
if (iNodeParent.nodeType == DOMNode.DOCUMENT_NODE) { iNodeParent.documentElement = iNode;}
iNodeParent.appendChild(iNode); iNodeParent = iNode;}
else if(iEvt == XMLP._ELM_E) { iNodeParent = iNodeParent.parentNode;}
else if(iEvt == XMLP._ELM_EMP) { pName = p.getName(); pName = trim(pName, true, true); if (!this.namespaceAware) { iNode = doc.createElement(pName); for(var i = 0; i < p.getAttributeCount(); i++) { strName = p.getAttributeName(i); iAttr = iNode.getAttributeNode(strName); if(!iAttr) { iAttr = doc.createAttribute(strName);}
iAttr.setValue(p.getAttributeValue(i)); iNode.setAttributeNode(iAttr);}
}
else { iNode = doc.createElementNS("", p.getName()); iNode._namespaces = iNodeParent._namespaces._cloneNodes(iNode); for(var i = 0; i < p.getAttributeCount(); i++) { strName = p.getAttributeName(i); if (this._isNamespaceDeclaration(strName)) { var namespaceDec = this._parseNSName(strName); if (strName != "xmlns") { iNS = doc.createNamespace(strName);}
else { iNS = doc.createNamespace("");}
iNS.setValue(p.getAttributeValue(i)); iNode._namespaces.setNamedItem(iNS);}
else { iAttr = iNode.getAttributeNode(strName); if(!iAttr) { iAttr = doc.createAttributeNS("", strName);}
iAttr.setValue(p.getAttributeValue(i)); iNode.setAttributeNodeNS(iAttr); if (this._isIdDeclaration(strName)) { iNode.id = p.getAttributeValue(i);}
}
}
if (iNode._namespaces.getNamedItem(iNode.prefix)) { iNode.namespaceURI = iNode._namespaces.getNamedItem(iNode.prefix).value;}
for (var i = 0; i < iNode.attributes.length; i++) { if (iNode.attributes.item(i).prefix != "") { if (iNode._namespaces.getNamedItem(iNode.attributes.item(i).prefix)) { iNode.attributes.item(i).namespaceURI = iNode._namespaces.getNamedItem(iNode.attributes.item(i).prefix).value;}
}
}
}
if (iNodeParent.nodeType == DOMNode.DOCUMENT_NODE) { iNodeParent.documentElement = iNode;}
iNodeParent.appendChild(iNode);}
else if(iEvt == XMLP._TEXT || iEvt == XMLP._ENTITY) { var pContent = p.getContent().substring(p.getContentBegin(), p.getContentEnd()); if (!this.preserveWhiteSpace ) { if (trim(pContent, true, true) == "") { pContent = "";}
}
if (pContent.length > 0) { var textNode = doc.createTextNode(pContent); iNodeParent.appendChild(textNode); if (iEvt == XMLP._ENTITY) { entitiesList[entitiesList.length] = textNode;}
else { textNodesList[textNodesList.length] = textNode;}
}
}
else if(iEvt == XMLP._PI) { iNodeParent.appendChild(doc.createProcessingInstruction(p.getName(), p.getContent().substring(p.getContentBegin(), p.getContentEnd())));}
else if(iEvt == XMLP._CDATA) { pContent = p.getContent().substring(p.getContentBegin(), p.getContentEnd()); if (!this.preserveWhiteSpace) { pContent = trim(pContent, true, true); pContent.replace(/ +/g, ' ');}
if (pContent.length > 0) { iNodeParent.appendChild(doc.createCDATASection(pContent));}
}
else if(iEvt == XMLP._COMMENT) { var pContent = p.getContent().substring(p.getContentBegin(), p.getContentEnd()); if (!this.preserveWhiteSpace) { pContent = trim(pContent, true, true); pContent.replace(/ +/g, ' ');}
if (pContent.length > 0) { iNodeParent.appendChild(doc.createComment(pContent));}
}
else if(iEvt == XMLP._DTD) { }
else if(iEvt == XMLP._ERROR) { throw(new DOMException(DOMException.SYNTAX_ERR));}
else if(iEvt == XMLP._NONE) { if (iNodeParent == doc) { break;}
else { throw(new DOMException(DOMException.SYNTAX_ERR));}
}
}
var intCount = entitiesList.length; for (intLoop = 0; intLoop < intCount; intLoop++) { var entity = entitiesList[intLoop]; var parentNode = entity.getParentNode(); if (parentNode) { parentNode.normalize(); if(!this.preserveWhiteSpace) { var children = parentNode.getChildNodes(); var intCount2 = children.getLength(); for ( intLoop2 = 0; intLoop2 < intCount2; intLoop2++) { var child = children.item(intLoop2); if (child.getNodeType() == DOMNode.TEXT_NODE) { var childData = child.getData(); childData = trim(childData, true, true); childData.replace(/ +/g, ' '); child.setData(childData);}
}
}
}
}
if (!this.preserveWhiteSpace) { var intCount = textNodesList.length; for (intLoop = 0; intLoop < intCount; intLoop++) { var node = textNodesList[intLoop]; if (node.getParentNode() != null) { var nodeData = node.getData(); nodeData = trim(nodeData, true, true); nodeData.replace(/ +/g, ' '); node.setData(nodeData);}
}
}
}; DOMImplementation.prototype._isNamespaceDeclaration = function DOMImplementation__isNamespaceDeclaration(attributeName) { return (attributeName.indexOf('xmlns') > -1);}
DOMImplementation.prototype._isIdDeclaration = function DOMImplementation__isIdDeclaration(attributeName) { return (attributeName.toLowerCase() == 'id');}
DOMImplementation.prototype._isValidName = function DOMImplementation__isValidName(name) { return name.match(re_validName);}
re_validName = /^[a-zA-Z_:][a-zA-Z0-9\.\-_:]*$/; DOMImplementation.prototype._isValidString = function DOMImplementation__isValidString(name) { return (name.search(re_invalidStringChars) < 0);}
re_invalidStringChars = /\x01|\x02|\x03|\x04|\x05|\x06|\x07|\x08|\x0B|\x0C|\x0E|\x0F|\x10|\x11|\x12|\x13|\x14|\x15|\x16|\x17|\x18|\x19|\x1A|\x1B|\x1C|\x1D|\x1E|\x1F|\x7F/
DOMImplementation.prototype._parseNSName = function DOMImplementation__parseNSName(qualifiedName) { var resultNSName = new Object(); resultNSName.prefix = qualifiedName; resultNSName.namespaceName = ""; delimPos = qualifiedName.indexOf(':'); if (delimPos > -1) { resultNSName.prefix = qualifiedName.substring(0, delimPos); resultNSName.namespaceName = qualifiedName.substring(delimPos +1, qualifiedName.length);}
return resultNSName;}
DOMImplementation.prototype._parseQName = function DOMImplementation__parseQName(qualifiedName) { var resultQName = new Object(); resultQName.localName = qualifiedName; resultQName.prefix = ""; delimPos = qualifiedName.indexOf(':'); if (delimPos > -1) { resultQName.prefix = qualifiedName.substring(0, delimPos); resultQName.localName = qualifiedName.substring(delimPos +1, qualifiedName.length);}
return resultQName;}
DOMNodeList = function(ownerDocument, parentNode) { this._class = addClass(this._class, "DOMNodeList"); this._nodes = new Array(); this.length = 0; this.parentNode = parentNode; this.ownerDocument = ownerDocument; this._readonly = false;}; DOMNodeList.prototype.getLength = function DOMNodeList_getLength() { return this.length;}; DOMNodeList.prototype.item = function DOMNodeList_item(index) { var ret = null; if ((index >= 0) && (index < this._nodes.length)) { ret = this._nodes[index];}
return ret;}; DOMNodeList.prototype._findItemIndex = function DOMNodeList__findItemIndex(id) { var ret = -1; if (id > -1) { for (var i=0; i<this._nodes.length; i++) { if (this._nodes[i]._id == id) { ret = i; break;}
}
}
return ret;}; DOMNodeList.prototype._insertBefore = function DOMNodeList__insertBefore(newChild, refChildIndex) { if ((refChildIndex >= 0) && (refChildIndex < this._nodes.length)) { var tmpArr = new Array(); tmpArr = this._nodes.slice(0, refChildIndex); if (newChild.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) { tmpArr = tmpArr.concat(newChild.childNodes._nodes);}
else { tmpArr[tmpArr.length] = newChild;}
this._nodes = tmpArr.concat(this._nodes.slice(refChildIndex)); this.length = this._nodes.length;}
}; DOMNodeList.prototype._replaceChild = function DOMNodeList__replaceChild(newChild, refChildIndex) { var ret = null; if ((refChildIndex >= 0) && (refChildIndex < this._nodes.length)) { ret = this._nodes[refChildIndex]; if (newChild.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) { var tmpArr = new Array(); tmpArr = this._nodes.slice(0, refChildIndex); tmpArr = tmpArr.concat(newChild.childNodes._nodes); this._nodes = tmpArr.concat(this._nodes.slice(refChildIndex + 1));}
else { this._nodes[refChildIndex] = newChild;}
}
return ret;}; DOMNodeList.prototype._removeChild = function DOMNodeList__removeChild(refChildIndex) { var ret = null; if (refChildIndex > -1) { ret = this._nodes[refChildIndex]; var tmpArr = new Array(); tmpArr = this._nodes.slice(0, refChildIndex); this._nodes = tmpArr.concat(this._nodes.slice(refChildIndex +1)); this.length = this._nodes.length;}
return ret;}; DOMNodeList.prototype._appendChild = function DOMNodeList__appendChild(newChild) { if (newChild.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) { this._nodes = this._nodes.concat(newChild.childNodes._nodes);}
else { this._nodes[this._nodes.length] = newChild;}
this.length = this._nodes.length;}; DOMNodeList.prototype._cloneNodes = function DOMNodeList__cloneNodes(deep, parentNode) { var cloneNodeList = new DOMNodeList(this.ownerDocument, parentNode); for (var i=0; i < this._nodes.length; i++) { cloneNodeList._appendChild(this._nodes[i].cloneNode(deep));}
return cloneNodeList;}; DOMNodeList.prototype.toString = function DOMNodeList_toString() { var ret = ""; for (var i=0; i < this.length; i++) { ret += this._nodes[i].toString();}
return ret;}; DOMNamedNodeMap = function(ownerDocument, parentNode) { this._class = addClass(this._class, "DOMNamedNodeMap"); this.DOMNodeList = DOMNodeList; this.DOMNodeList(ownerDocument, parentNode);}; DOMNamedNodeMap.prototype = new DOMNodeList; DOMNamedNodeMap.prototype.getNamedItem = function DOMNamedNodeMap_getNamedItem(name) { var ret = null; var itemIndex = this._findNamedItemIndex(name); if (itemIndex > -1) { ret = this._nodes[itemIndex];}
return ret;}; DOMNamedNodeMap.prototype.setNamedItem = function DOMNamedNodeMap_setNamedItem(arg) { if (this.ownerDocument.implementation.errorChecking) { if (this.ownerDocument != arg.ownerDocument) { throw(new DOMException(DOMException.WRONG_DOCUMENT_ERR));}
if (this._readonly || (this.parentNode && this.parentNode._readonly)) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
if (arg.ownerElement && (arg.ownerElement != this.parentNode)) { throw(new DOMException(DOMException.INUSE_ATTRIBUTE_ERR));}
}
var itemIndex = this._findNamedItemIndex(arg.name); var ret = null; if (itemIndex > -1) { ret = this._nodes[itemIndex]; if (this.ownerDocument.implementation.errorChecking && ret._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
else { this._nodes[itemIndex] = arg;}
}
else { this._nodes[this.length] = arg;}
this.length = this._nodes.length; arg.ownerElement = this.parentNode; return ret;}; DOMNamedNodeMap.prototype.removeNamedItem = function DOMNamedNodeMap_removeNamedItem(name) { var ret = null; if (this.ownerDocument.implementation.errorChecking && (this._readonly || (this.parentNode && this.parentNode._readonly))) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
var itemIndex = this._findNamedItemIndex(name); if (this.ownerDocument.implementation.errorChecking && (itemIndex < 0)) { throw(new DOMException(DOMException.NOT_FOUND_ERR));}
var oldNode = this._nodes[itemIndex]; if (this.ownerDocument.implementation.errorChecking && oldNode._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
return this._removeChild(itemIndex);}; DOMNamedNodeMap.prototype.getNamedItemNS = function DOMNamedNodeMap_getNamedItemNS(namespaceURI, localName) { var ret = null; var itemIndex = this._findNamedItemNSIndex(namespaceURI, localName); if (itemIndex > -1) { ret = this._nodes[itemIndex];}
return ret;}; DOMNamedNodeMap.prototype.setNamedItemNS = function DOMNamedNodeMap_setNamedItemNS(arg) { if (this.ownerDocument.implementation.errorChecking) { if (this._readonly || (this.parentNode && this.parentNode._readonly)) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
if (this.ownerDocument != arg.ownerDocument) { throw(new DOMException(DOMException.WRONG_DOCUMENT_ERR));}
if (arg.ownerElement && (arg.ownerElement != this.parentNode)) { throw(new DOMException(DOMException.INUSE_ATTRIBUTE_ERR));}
}
var itemIndex = this._findNamedItemNSIndex(arg.namespaceURI, arg.localName); var ret = null; if (itemIndex > -1) { ret = this._nodes[itemIndex]; if (this.ownerDocument.implementation.errorChecking && ret._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
else { this._nodes[itemIndex] = arg;}
}
else { this._nodes[this.length] = arg;}
this.length = this._nodes.length; arg.ownerElement = this.parentNode; return ret;}; DOMNamedNodeMap.prototype.removeNamedItemNS = function DOMNamedNodeMap_removeNamedItemNS(namespaceURI, localName) { var ret = null; if (this.ownerDocument.implementation.errorChecking && (this._readonly || (this.parentNode && this.parentNode._readonly))) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
var itemIndex = this._findNamedItemNSIndex(namespaceURI, localName); if (this.ownerDocument.implementation.errorChecking && (itemIndex < 0)) { throw(new DOMException(DOMException.NOT_FOUND_ERR));}
var oldNode = this._nodes[itemIndex]; if (this.ownerDocument.implementation.errorChecking && oldNode._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
return this._removeChild(itemIndex);}; DOMNamedNodeMap.prototype._findNamedItemIndex = function DOMNamedNodeMap__findNamedItemIndex(name) { var ret = -1; for (var i=0; i<this._nodes.length; i++) { if (this._nodes[i].name == name) { ret = i; break;}
}
return ret;}; DOMNamedNodeMap.prototype._findNamedItemNSIndex = function DOMNamedNodeMap__findNamedItemNSIndex(namespaceURI, localName) { var ret = -1; if (localName) { for (var i=0; i<this._nodes.length; i++) { if ((this._nodes[i].namespaceURI == namespaceURI) && (this._nodes[i].localName == localName)) { ret = i; break;}
}
}
return ret;}; DOMNamedNodeMap.prototype._hasAttribute = function DOMNamedNodeMap__hasAttribute(name) { var ret = false; var itemIndex = this._findNamedItemIndex(name); if (itemIndex > -1) { ret = true;}
return ret;}
DOMNamedNodeMap.prototype._hasAttributeNS = function DOMNamedNodeMap__hasAttributeNS(namespaceURI, localName) { var ret = false; var itemIndex = this._findNamedItemNSIndex(namespaceURI, localName); if (itemIndex > -1) { ret = true;}
return ret;}
DOMNamedNodeMap.prototype._cloneNodes = function DOMNamedNodeMap__cloneNodes(parentNode) { var cloneNamedNodeMap = new DOMNamedNodeMap(this.ownerDocument, parentNode); for (var i=0; i < this._nodes.length; i++) { cloneNamedNodeMap._appendChild(this._nodes[i].cloneNode(false));}
return cloneNamedNodeMap;}; DOMNamedNodeMap.prototype.toString = function DOMNamedNodeMap_toString() { var ret = ""; for (var i=0; i < this.length -1; i++) { ret += this._nodes[i].toString() +" ";}
if (this.length > 0) { ret += this._nodes[this.length -1].toString();}
return ret;}; DOMNamespaceNodeMap = function(ownerDocument, parentNode) { this._class = addClass(this._class, "DOMNamespaceNodeMap"); this.DOMNamedNodeMap = DOMNamedNodeMap; this.DOMNamedNodeMap(ownerDocument, parentNode);}; DOMNamespaceNodeMap.prototype = new DOMNamedNodeMap; DOMNamespaceNodeMap.prototype._findNamedItemIndex = function DOMNamespaceNodeMap__findNamedItemIndex(localName) { var ret = -1; for (var i=0; i<this._nodes.length; i++) { if (this._nodes[i].localName == localName) { ret = i; break;}
}
return ret;}; DOMNamespaceNodeMap.prototype._cloneNodes = function DOMNamespaceNodeMap__cloneNodes(parentNode) { var cloneNamespaceNodeMap = new DOMNamespaceNodeMap(this.ownerDocument, parentNode); for (var i=0; i < this._nodes.length; i++) { cloneNamespaceNodeMap._appendChild(this._nodes[i].cloneNode(false));}
return cloneNamespaceNodeMap;}; DOMNamespaceNodeMap.prototype.toString = function DOMNamespaceNodeMap_toString() { var ret = ""; for (var ind = 0; ind < this._nodes.length; ind++) { var ns = null; try { var ns = this.parentNode.parentNode._namespaces.getNamedItem(this._nodes[ind].localName);}
catch (e) { break;}
if (!(ns && (""+ ns.nodeValue == ""+ this._nodes[ind].nodeValue))) { ret += this._nodes[ind].toString() +" ";}
}
return ret;}; DOMNode = function(ownerDocument) { this._class = addClass(this._class, "DOMNode"); if (ownerDocument) { this._id = ownerDocument._genId();}
this.namespaceURI = ""; this.prefix = ""; this.localName = ""; this.nodeName = ""; this.nodeValue = ""; this.nodeType = 0; this.parentNode = null; this.childNodes = new DOMNodeList(ownerDocument, this); this.firstChild = null; this.lastChild = null; this.previousSibling = null; this.nextSibling = null; this.attributes = new DOMNamedNodeMap(ownerDocument, this); this.ownerDocument = ownerDocument; this._namespaces = new DOMNamespaceNodeMap(ownerDocument, this); this._readonly = false;}; DOMNode.ELEMENT_NODE = 1; DOMNode.ATTRIBUTE_NODE = 2; DOMNode.TEXT_NODE = 3; DOMNode.CDATA_SECTION_NODE = 4; DOMNode.ENTITY_REFERENCE_NODE = 5; DOMNode.ENTITY_NODE = 6; DOMNode.PROCESSING_INSTRUCTION_NODE = 7; DOMNode.COMMENT_NODE = 8; DOMNode.DOCUMENT_NODE = 9; DOMNode.DOCUMENT_TYPE_NODE = 10; DOMNode.DOCUMENT_FRAGMENT_NODE = 11; DOMNode.NOTATION_NODE = 12; DOMNode.NAMESPACE_NODE = 13; DOMNode.prototype.hasAttributes = function DOMNode_hasAttributes() { if (this.attributes.length == 0) { return false;}
else { return true;}
}; DOMNode.prototype.getNodeName = function DOMNode_getNodeName() { return this.nodeName;}; DOMNode.prototype.getNodeValue = function DOMNode_getNodeValue() { return this.nodeValue;}; DOMNode.prototype.setNodeValue = function DOMNode_setNodeValue(nodeValue) { if (this.ownerDocument.implementation.errorChecking && this._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
this.nodeValue = nodeValue;}; DOMNode.prototype.getNodeType = function DOMNode_getNodeType() { return this.nodeType;}; DOMNode.prototype.getParentNode = function DOMNode_getParentNode() { return this.parentNode;}; DOMNode.prototype.getChildNodes = function DOMNode_getChildNodes() { return this.childNodes;}; DOMNode.prototype.getFirstChild = function DOMNode_getFirstChild() { return this.firstChild;}; DOMNode.prototype.getLastChild = function DOMNode_getLastChild() { return this.lastChild;}; DOMNode.prototype.getPreviousSibling = function DOMNode_getPreviousSibling() { return this.previousSibling;}; DOMNode.prototype.getNextSibling = function DOMNode_getNextSibling() { return this.nextSibling;}; DOMNode.prototype.getAttributes = function DOMNode_getAttributes() { return this.attributes;}; DOMNode.prototype.getOwnerDocument = function DOMNode_getOwnerDocument() { return this.ownerDocument;}; DOMNode.prototype.getNamespaceURI = function DOMNode_getNamespaceURI() { return this.namespaceURI;}; DOMNode.prototype.getPrefix = function DOMNode_getPrefix() { return this.prefix;}; DOMNode.prototype.setPrefix = function DOMNode_setPrefix(prefix) { if (this.ownerDocument.implementation.errorChecking) { if (this._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
if (!this.ownerDocument.implementation._isValidName(prefix)) { throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));}
if (!this.ownerDocument._isValidNamespace(this.namespaceURI, prefix +":"+ this.localName)) { throw(new DOMException(DOMException.NAMESPACE_ERR));}
if ((prefix == "xmlns") && (this.namespaceURI != "http://www.w3.org/2000/xmlns/")) { throw(new DOMException(DOMException.NAMESPACE_ERR));}
if ((prefix == "") && (this.localName == "xmlns")) { throw(new DOMException(DOMException.NAMESPACE_ERR));}
}
this.prefix = prefix; if (this.prefix != "") { this.nodeName = this.prefix +":"+ this.localName;}
else { this.nodeName = this.localName;}
}; DOMNode.prototype.getLocalName = function DOMNode_getLocalName() { return this.localName;}; DOMNode.prototype.insertBefore = function DOMNode_insertBefore(newChild, refChild) { var prevNode; if (this.ownerDocument.implementation.errorChecking) { if (this._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
if (this.ownerDocument != newChild.ownerDocument) { throw(new DOMException(DOMException.WRONG_DOCUMENT_ERR));}
if (this._isAncestor(newChild)) { throw(new DOMException(DOMException.HIERARCHY_REQUEST_ERR));}
}
if (refChild) { var itemIndex = this.childNodes._findItemIndex(refChild._id); if (this.ownerDocument.implementation.errorChecking && (itemIndex < 0)) { throw(new DOMException(DOMException.NOT_FOUND_ERR));}
var newChildParent = newChild.parentNode; if (newChildParent) { newChildParent.removeChild(newChild);}
this.childNodes._insertBefore(newChild, this.childNodes._findItemIndex(refChild._id)); prevNode = refChild.previousSibling; if (newChild.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) { if (newChild.childNodes._nodes.length > 0) { for (var ind = 0; ind < newChild.childNodes._nodes.length; ind++) { newChild.childNodes._nodes[ind].parentNode = this;}
refChild.previousSibling = newChild.childNodes._nodes[newChild.childNodes._nodes.length-1];}
}
else { newChild.parentNode = this; refChild.previousSibling = newChild;}
}
else { prevNode = this.lastChild; this.appendChild(newChild);}
if (newChild.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) { if (newChild.childNodes._nodes.length > 0) { if (prevNode) { prevNode.nextSibling = newChild.childNodes._nodes[0];}
else { this.firstChild = newChild.childNodes._nodes[0];}
newChild.childNodes._nodes[0].previousSibling = prevNode; newChild.childNodes._nodes[newChild.childNodes._nodes.length-1].nextSibling = refChild;}
}
else { if (prevNode) { prevNode.nextSibling = newChild;}
else { this.firstChild = newChild;}
newChild.previousSibling = prevNode; newChild.nextSibling = refChild;}
return newChild;}; DOMNode.prototype.replaceChild = function DOMNode_replaceChild(newChild, oldChild) { var ret = null; if (this.ownerDocument.implementation.errorChecking) { if (this._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
if (this.ownerDocument != newChild.ownerDocument) { throw(new DOMException(DOMException.WRONG_DOCUMENT_ERR));}
if (this._isAncestor(newChild)) { throw(new DOMException(DOMException.HIERARCHY_REQUEST_ERR));}
}
var index = this.childNodes._findItemIndex(oldChild._id); if (this.ownerDocument.implementation.errorChecking && (index < 0)) { throw(new DOMException(DOMException.NOT_FOUND_ERR));}
var newChildParent = newChild.parentNode; if (newChildParent) { newChildParent.removeChild(newChild);}
ret = this.childNodes._replaceChild(newChild, index); if (newChild.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) { if (newChild.childNodes._nodes.length > 0) { for (var ind = 0; ind < newChild.childNodes._nodes.length; ind++) { newChild.childNodes._nodes[ind].parentNode = this;}
if (oldChild.previousSibling) { oldChild.previousSibling.nextSibling = newChild.childNodes._nodes[0];}
else { this.firstChild = newChild.childNodes._nodes[0];}
if (oldChild.nextSibling) { oldChild.nextSibling.previousSibling = newChild;}
else { this.lastChild = newChild.childNodes._nodes[newChild.childNodes._nodes.length-1];}
newChild.childNodes._nodes[0].previousSibling = oldChild.previousSibling; newChild.childNodes._nodes[newChild.childNodes._nodes.length-1].nextSibling = oldChild.nextSibling;}
}
else { newChild.parentNode = this; if (oldChild.previousSibling) { oldChild.previousSibling.nextSibling = newChild;}
else { this.firstChild = newChild;}
if (oldChild.nextSibling) { oldChild.nextSibling.previousSibling = newChild;}
else { this.lastChild = newChild;}
newChild.previousSibling = oldChild.previousSibling; newChild.nextSibling = oldChild.nextSibling;}
return ret;}; DOMNode.prototype.removeChild = function DOMNode_removeChild(oldChild) { if (this.ownerDocument.implementation.errorChecking && (this._readonly || oldChild._readonly)) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
var itemIndex = this.childNodes._findItemIndex(oldChild._id); if (this.ownerDocument.implementation.errorChecking && (itemIndex < 0)) { throw(new DOMException(DOMException.NOT_FOUND_ERR));}
this.childNodes._removeChild(itemIndex); oldChild.parentNode = null; if (oldChild.previousSibling) { oldChild.previousSibling.nextSibling = oldChild.nextSibling;}
else { this.firstChild = oldChild.nextSibling;}
if (oldChild.nextSibling) { oldChild.nextSibling.previousSibling = oldChild.previousSibling;}
else { this.lastChild = oldChild.previousSibling;}
oldChild.previousSibling = null; oldChild.nextSibling = null; return oldChild;}; DOMNode.prototype.appendChild = function DOMNode_appendChild(newChild) { if (this.ownerDocument.implementation.errorChecking) { if (this._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
if (this.ownerDocument != newChild.ownerDocument) { throw(new DOMException(DOMException.WRONG_DOCUMENT_ERR));}
if (this._isAncestor(newChild)) { throw(new DOMException(DOMException.HIERARCHY_REQUEST_ERR));}
}
var newChildParent = newChild.parentNode; if (newChildParent) { newChildParent.removeChild(newChild);}
this.childNodes._appendChild(newChild); if (newChild.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) { if (newChild.childNodes._nodes.length > 0) { for (var ind = 0; ind < newChild.childNodes._nodes.length; ind++) { newChild.childNodes._nodes[ind].parentNode = this;}
if (this.lastChild) { this.lastChild.nextSibling = newChild.childNodes._nodes[0]; newChild.childNodes._nodes[0].previousSibling = this.lastChild; this.lastChild = newChild.childNodes._nodes[newChild.childNodes._nodes.length-1];}
else { this.lastChild = newChild.childNodes._nodes[newChild.childNodes._nodes.length-1]; this.firstChild = newChild.childNodes._nodes[0];}
}
}
else { newChild.parentNode = this; if (this.lastChild) { this.lastChild.nextSibling = newChild; newChild.previousSibling = this.lastChild; this.lastChild = newChild;}
else { this.lastChild = newChild; this.firstChild = newChild;}
}
return newChild;}; DOMNode.prototype.hasChildNodes = function DOMNode_hasChildNodes() { return (this.childNodes.length > 0);}; DOMNode.prototype.cloneNode = function DOMNode_cloneNode(deep) { try { return this.ownerDocument.importNode(this, deep);}
catch (e) { return null;}
}; DOMNode.prototype.normalize = function DOMNode_normalize() { var inode; var nodesToRemove = new DOMNodeList(); if (this.nodeType == DOMNode.ELEMENT_NODE || this.nodeType == DOMNode.DOCUMENT_NODE) { var adjacentTextNode = null; for(var i = 0; i < this.childNodes.length; i++) { inode = this.childNodes.item(i); if (inode.nodeType == DOMNode.TEXT_NODE) { if (inode.length < 1) { nodesToRemove._appendChild(inode);}
else { if (adjacentTextNode) { adjacentTextNode.appendData(inode.data); nodesToRemove._appendChild(inode);}
else { adjacentTextNode = inode;}
}
}
else { adjacentTextNode = null; inode.normalize();}
}
for(var i = 0; i < nodesToRemove.length; i++) { inode = nodesToRemove.item(i); inode.parentNode.removeChild(inode);}
}
}; DOMNode.prototype.isSupported = function DOMNode_isSupported(feature, version) { return this.ownerDocument.implementation.hasFeature(feature, version);}
DOMNode.prototype.getElementsByTagName = function DOMNode_getElementsByTagName(tagname) { return this._getElementsByTagNameRecursive(tagname, new DOMNodeList(this.ownerDocument));}; DOMNode.prototype._getElementsByTagNameRecursive = function DOMNode__getElementsByTagNameRecursive(tagname, nodeList) { if (this.nodeType == DOMNode.ELEMENT_NODE || this.nodeType == DOMNode.DOCUMENT_NODE) { if((this.nodeName == tagname) || (tagname == "*")) { nodeList._appendChild(this);}
for(var i = 0; i < this.childNodes.length; i++) { nodeList = this.childNodes.item(i)._getElementsByTagNameRecursive(tagname, nodeList);}
}
return nodeList;}; DOMNode.prototype.getXML = function DOMNode_getXML() { return this.toString();}
DOMNode.prototype.getElementsByTagNameNS = function DOMNode_getElementsByTagNameNS(namespaceURI, localName) { return this._getElementsByTagNameNSRecursive(namespaceURI, localName, new DOMNodeList(this.ownerDocument));}; DOMNode.prototype._getElementsByTagNameNSRecursive = function DOMNode__getElementsByTagNameNSRecursive(namespaceURI, localName, nodeList) { if (this.nodeType == DOMNode.ELEMENT_NODE || this.nodeType == DOMNode.DOCUMENT_NODE) { if (((this.namespaceURI == namespaceURI) || (namespaceURI == "*")) && ((this.localName == localName) || (localName == "*"))) { nodeList._appendChild(this);}
for(var i = 0; i < this.childNodes.length; i++) { nodeList = this.childNodes.item(i)._getElementsByTagNameNSRecursive(namespaceURI, localName, nodeList);}
}
return nodeList;}; DOMNode.prototype._isAncestor = function DOMNode__isAncestor(node) { return ((this == node) || ((this.parentNode) && (this.parentNode._isAncestor(node))));}
DOMNode.prototype.importNode = function DOMNode_importNode(importedNode, deep) { var importNode; this.getOwnerDocument()._performingImportNodeOperation = true; try { if (importedNode.nodeType == DOMNode.ELEMENT_NODE) { if (!this.ownerDocument.implementation.namespaceAware) { importNode = this.ownerDocument.createElement(importedNode.tagName); for(var i = 0; i < importedNode.attributes.length; i++) { importNode.setAttribute(importedNode.attributes.item(i).name, importedNode.attributes.item(i).value);}
}
else { importNode = this.ownerDocument.createElementNS(importedNode.namespaceURI, importedNode.nodeName); for(var i = 0; i < importedNode.attributes.length; i++) { importNode.setAttributeNS(importedNode.attributes.item(i).namespaceURI, importedNode.attributes.item(i).name, importedNode.attributes.item(i).value);}
for(var i = 0; i < importedNode._namespaces.length; i++) { importNode._namespaces._nodes[i] = this.ownerDocument.createNamespace(importedNode._namespaces.item(i).localName); importNode._namespaces._nodes[i].setValue(importedNode._namespaces.item(i).value);}
}
}
else if (importedNode.nodeType == DOMNode.ATTRIBUTE_NODE) { if (!this.ownerDocument.implementation.namespaceAware) { importNode = this.ownerDocument.createAttribute(importedNode.name);}
else { importNode = this.ownerDocument.createAttributeNS(importedNode.namespaceURI, importedNode.nodeName); for(var i = 0; i < importedNode._namespaces.length; i++) { importNode._namespaces._nodes[i] = this.ownerDocument.createNamespace(importedNode._namespaces.item(i).localName); importNode._namespaces._nodes[i].setValue(importedNode._namespaces.item(i).value);}
}
importNode.setValue(importedNode.value);}
else if (importedNode.nodeType == DOMNode.DOCUMENT_FRAGMENT) { importNode = this.ownerDocument.createDocumentFragment();}
else if (importedNode.nodeType == DOMNode.NAMESPACE_NODE) { importNode = this.ownerDocument.createNamespace(importedNode.nodeName); importNode.setValue(importedNode.value);}
else if (importedNode.nodeType == DOMNode.TEXT_NODE) { importNode = this.ownerDocument.createTextNode(importedNode.data);}
else if (importedNode.nodeType == DOMNode.CDATA_SECTION_NODE) { importNode = this.ownerDocument.createCDATASection(importedNode.data);}
else if (importedNode.nodeType == DOMNode.PROCESSING_INSTRUCTION_NODE) { importNode = this.ownerDocument.createProcessingInstruction(importedNode.target, importedNode.data);}
else if (importedNode.nodeType == DOMNode.COMMENT_NODE) { importNode = this.ownerDocument.createComment(importedNode.data);}
else { throw(new DOMException(DOMException.NOT_SUPPORTED_ERR));}
if (deep) { for(var i = 0; i < importedNode.childNodes.length; i++) { importNode.appendChild(this.ownerDocument.importNode(importedNode.childNodes.item(i), true));}
}
this.getOwnerDocument()._performingImportNodeOperation = false; return importNode;}
catch (eAny) { this.getOwnerDocument()._performingImportNodeOperation = false; throw eAny;}
}; DOMNode.prototype.__escapeString = function DOMNode__escapeString(str) { return __escapeString(str);}; DOMNode.prototype.__unescapeString = function DOMNode__unescapeString(str) { return __unescapeString(str);}; DOMDocument = function(implementation) { this._class = addClass(this._class, "DOMDocument"); this.DOMNode = DOMNode; this.DOMNode(this); this.doctype = null; this.implementation = implementation; this.documentElement = null; this.all = new Array(); this.nodeName = "#document"; this.nodeType = DOMNode.DOCUMENT_NODE; this._id = 0; this._lastId = 0; this._parseComplete = false; this.ownerDocument = this; this._performingImportNodeOperation = false;}; DOMDocument.prototype = new DOMNode; DOMDocument.prototype.getDoctype = function DOMDocument_getDoctype() { return this.doctype;}; DOMDocument.prototype.getImplementation = function DOMDocument_implementation() { return this.implementation;}; DOMDocument.prototype.getDocumentElement = function DOMDocument_getDocumentElement() { return this.documentElement;}; DOMDocument.prototype.createElement = function DOMDocument_createElement(tagName) { if (this.ownerDocument.implementation.errorChecking && (!this.ownerDocument.implementation._isValidName(tagName))) { throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));}
var node = new DOMElement(this); node.tagName = tagName; node.nodeName = tagName; this.all[this.all.length] = node; return node;}; DOMDocument.prototype.createDocumentFragment = function DOMDocument_createDocumentFragment() { var node = new DOMDocumentFragment(this); return node;}; DOMDocument.prototype.createTextNode = function DOMDocument_createTextNode(data) { var node = new DOMText(this); node.data = data; node.nodeValue = data; node.length = data.length; return node;}; DOMDocument.prototype.createComment = function DOMDocument_createComment(data) { var node = new DOMComment(this); node.data = data; node.nodeValue = data; node.length = data.length; return node;}; DOMDocument.prototype.createCDATASection = function DOMDocument_createCDATASection(data) { var node = new DOMCDATASection(this); node.data = data; node.nodeValue = data; node.length = data.length; return node;}; DOMDocument.prototype.createProcessingInstruction = function DOMDocument_createProcessingInstruction(target, data) { if (this.ownerDocument.implementation.errorChecking && (!this.implementation._isValidName(target))) { throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));}
var node = new DOMProcessingInstruction(this); node.target = target; node.nodeName = target; node.data = data; node.nodeValue = data; node.length = data.length; return node;}; DOMDocument.prototype.createAttribute = function DOMDocument_createAttribute(name) { if (this.ownerDocument.implementation.errorChecking && (!this.ownerDocument.implementation._isValidName(name))) { throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));}
var node = new DOMAttr(this); node.name = name; node.nodeName = name; return node;}; DOMDocument.prototype.createElementNS = function DOMDocument_createElementNS(namespaceURI, qualifiedName) { if (this.ownerDocument.implementation.errorChecking) { if (!this.ownerDocument._isValidNamespace(namespaceURI, qualifiedName)) { throw(new DOMException(DOMException.NAMESPACE_ERR));}
if (!this.ownerDocument.implementation._isValidName(qualifiedName)) { throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));}
}
var node = new DOMElement(this); var qname = this.implementation._parseQName(qualifiedName); node.nodeName = qualifiedName; node.namespaceURI = namespaceURI; node.prefix = qname.prefix; node.localName = qname.localName; node.tagName = qualifiedName; this.all[this.all.length] = node; return node;}; DOMDocument.prototype.createAttributeNS = function DOMDocument_createAttributeNS(namespaceURI, qualifiedName) { if (this.ownerDocument.implementation.errorChecking) { if (!this.ownerDocument._isValidNamespace(namespaceURI, qualifiedName, true)) { throw(new DOMException(DOMException.NAMESPACE_ERR));}
if (!this.ownerDocument.implementation._isValidName(qualifiedName)) { throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));}
}
var node = new DOMAttr(this); var qname = this.implementation._parseQName(qualifiedName); node.nodeName = qualifiedName
node.namespaceURI = namespaceURI
node.prefix = qname.prefix; node.localName = qname.localName; node.name = qualifiedName
node.nodeValue = ""; return node;}; DOMDocument.prototype.createNamespace = function DOMDocument_createNamespace(qualifiedName) { var node = new DOMNamespace(this); var qname = this.implementation._parseQName(qualifiedName); node.nodeName = qualifiedName
node.prefix = qname.prefix; node.localName = qname.localName; node.name = qualifiedName
node.nodeValue = ""; return node;}; DOMDocument.prototype.getElementById = function DOMDocument_getElementById(elementId) { retNode = null; for (var i=0; i < this.all.length; i++) { var node = this.all[i]; if ((node.id == elementId) && (node._isAncestor(node.ownerDocument.documentElement))) { retNode = node; break;}
}
return retNode;}; DOMDocument.prototype._genId = function DOMDocument__genId() { this._lastId += 1; return this._lastId;}; DOMDocument.prototype._isValidNamespace = function DOMDocument__isValidNamespace(namespaceURI, qualifiedName, isAttribute) { if (this._performingImportNodeOperation == true) { return true;}
var valid = true; var qName = this.implementation._parseQName(qualifiedName); if (this._parseComplete == true) { if (qName.localName.indexOf(":") > -1 ){ valid = false;}
if ((valid) && (!isAttribute)) { if (!namespaceURI) { valid = false;}
}
if ((valid) && (qName.prefix == "")) { valid = false;}
}
if ((valid) && (qName.prefix == "xml") && (namespaceURI != "http://www.w3.org/XML/1998/namespace")) { valid = false;}
return valid;}
DOMDocument.prototype.toString = function DOMDocument_toString() { return "" + this.childNodes;}
DOMElement = function(ownerDocument) { this._class = addClass(this._class, "DOMElement"); this.DOMNode = DOMNode; this.DOMNode(ownerDocument); this.tagName = ""; this.id = ""; this.nodeType = DOMNode.ELEMENT_NODE;}; DOMElement.prototype = new DOMNode; DOMElement.prototype.getTagName = function DOMElement_getTagName() { return this.tagName;}; DOMElement.prototype.getAttribute = function DOMElement_getAttribute(name) { var ret = ""; var attr = this.attributes.getNamedItem(name); if (attr) { ret = attr.value;}
return ret;}; DOMElement.prototype.setAttribute = function DOMElement_setAttribute(name, value) { var attr = this.attributes.getNamedItem(name); if (!attr) { attr = this.ownerDocument.createAttribute(name);}
var value = new String(value); if (this.ownerDocument.implementation.errorChecking) { if (attr._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
if (!this.ownerDocument.implementation._isValidString(value)) { throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));}
}
if (this.ownerDocument.implementation._isIdDeclaration(name)) { this.id = value;}
attr.value = value; attr.nodeValue = value; if (value.length > 0) { attr.specified = true;}
else { attr.specified = false;}
this.attributes.setNamedItem(attr);}; DOMElement.prototype.removeAttribute = function DOMElement_removeAttribute(name) { return this.attributes.removeNamedItem(name);}; DOMElement.prototype.getAttributeNode = function DOMElement_getAttributeNode(name) { return this.attributes.getNamedItem(name);}; DOMElement.prototype.setAttributeNode = function DOMElement_setAttributeNode(newAttr) { if (this.ownerDocument.implementation._isIdDeclaration(newAttr.name)) { this.id = newAttr.value;}
return this.attributes.setNamedItem(newAttr);}; DOMElement.prototype.removeAttributeNode = function DOMElement_removeAttributeNode(oldAttr) { if (this.ownerDocument.implementation.errorChecking && oldAttr._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
var itemIndex = this.attributes._findItemIndex(oldAttr._id); if (this.ownerDocument.implementation.errorChecking && (itemIndex < 0)) { throw(new DOMException(DOMException.NOT_FOUND_ERR));}
return this.attributes._removeChild(itemIndex);}; DOMElement.prototype.getAttributeNS = function DOMElement_getAttributeNS(namespaceURI, localName) { var ret = ""; var attr = this.attributes.getNamedItemNS(namespaceURI, localName); if (attr) { ret = attr.value;}
return ret;}; DOMElement.prototype.setAttributeNS = function DOMElement_setAttributeNS(namespaceURI, qualifiedName, value) { var attr = this.attributes.getNamedItem(namespaceURI, qualifiedName); if (!attr) { attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);}
var value = new String(value); if (this.ownerDocument.implementation.errorChecking) { if (attr._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
if (!this.ownerDocument._isValidNamespace(namespaceURI, qualifiedName)) { throw(new DOMException(DOMException.NAMESPACE_ERR));}
if (!this.ownerDocument.implementation._isValidString(value)) { throw(new DOMException(DOMException.INVALID_CHARACTER_ERR));}
}
if (this.ownerDocument.implementation._isIdDeclaration(name)) { this.id = value;}
attr.value = value; attr.nodeValue = value; if (value.length > 0) { attr.specified = true;}
else { attr.specified = false;}
this.attributes.setNamedItemNS(attr);}; DOMElement.prototype.removeAttributeNS = function DOMElement_removeAttributeNS(namespaceURI, localName) { return this.attributes.removeNamedItemNS(namespaceURI, localName);}; DOMElement.prototype.getAttributeNodeNS = function DOMElement_getAttributeNodeNS(namespaceURI, localName) { return this.attributes.getNamedItemNS(namespaceURI, localName);}; DOMElement.prototype.setAttributeNodeNS = function DOMElement_setAttributeNodeNS(newAttr) { if ((newAttr.prefix == "") && this.ownerDocument.implementation._isIdDeclaration(newAttr.name)) { this.id = newAttr.value;}
return this.attributes.setNamedItemNS(newAttr);}; DOMElement.prototype.hasAttribute = function DOMElement_hasAttribute(name) { return this.attributes._hasAttribute(name);}
DOMElement.prototype.hasAttributeNS = function DOMElement_hasAttributeNS(namespaceURI, localName) { return this.attributes._hasAttributeNS(namespaceURI, localName);}
DOMElement.prototype.toString = function DOMElement_toString() { var ret = ""; var ns = this._namespaces.toString(); if (ns.length > 0) ns = " "+ ns; var attrs = this.attributes.toString(); if (attrs.length > 0) attrs = " "+ attrs; ret += "<" + this.nodeName + ns + attrs +">"; ret += this.childNodes.toString();; ret += "</" + this.nodeName+">"; return ret;}
DOMAttr = function(ownerDocument) { this._class = addClass(this._class, "DOMAttr"); this.DOMNode = DOMNode; this.DOMNode(ownerDocument); this.name = ""; this.specified = false; this.value = ""; this.nodeType = DOMNode.ATTRIBUTE_NODE; this.ownerElement = null; this.childNodes = null; this.attributes = null;}; DOMAttr.prototype = new DOMNode; DOMAttr.prototype.getName = function DOMAttr_getName() { return this.nodeName;}; DOMAttr.prototype.getSpecified = function DOMAttr_getSpecified() { return this.specified;}; DOMAttr.prototype.getValue = function DOMAttr_getValue() { return this.nodeValue;}; DOMAttr.prototype.setValue = function DOMAttr_setValue(value) { if (this.ownerDocument.implementation.errorChecking && this._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
this.setNodeValue(value);}; DOMAttr.prototype.setNodeValue = function DOMAttr_setNodeValue(value) { this.nodeValue = new String(value); this.value = this.nodeValue; this.specified = (this.value.length > 0);}; DOMAttr.prototype.toString = function DOMAttr_toString() { var ret = ""; ret += this.nodeName +"=\""+ this.__escapeString(this.nodeValue) +"\""; return ret;}
DOMAttr.prototype.getOwnerElement = function() { return this.ownerElement;}
DOMNamespace = function(ownerDocument) { this._class = addClass(this._class, "DOMNamespace"); this.DOMNode = DOMNode; this.DOMNode(ownerDocument); this.name = ""; this.specified = false; this.value = ""; this.nodeType = DOMNode.NAMESPACE_NODE;}; DOMNamespace.prototype = new DOMNode; DOMNamespace.prototype.getValue = function DOMNamespace_getValue() { return this.nodeValue;}; DOMNamespace.prototype.setValue = function DOMNamespace_setValue(value) { this.nodeValue = new String(value); this.value = this.nodeValue;}; DOMNamespace.prototype.toString = function DOMNamespace_toString() { var ret = ""; if (this.nodeName != "") { ret += this.nodeName +"=\""+ this.__escapeString(this.nodeValue) +"\"";}
else { ret += "xmlns=\""+ this.__escapeString(this.nodeValue) +"\"";}
return ret;}
DOMCharacterData = function(ownerDocument) { this._class = addClass(this._class, "DOMCharacterData"); this.DOMNode = DOMNode; this.DOMNode(ownerDocument); this.data = ""; this.length = 0;}; DOMCharacterData.prototype = new DOMNode; DOMCharacterData.prototype.getData = function DOMCharacterData_getData() { return this.nodeValue;}; DOMCharacterData.prototype.setData = function DOMCharacterData_setData(data) { this.setNodeValue(data);}; DOMCharacterData.prototype.setNodeValue = function DOMCharacterData_setNodeValue(data) { if (this.ownerDocument.implementation.errorChecking && this._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
this.nodeValue = new String(data); this.data = this.nodeValue; this.length = this.nodeValue.length;}; DOMCharacterData.prototype.getLength = function DOMCharacterData_getLength() { return this.nodeValue.length;}; DOMCharacterData.prototype.substringData = function DOMCharacterData_substringData(offset, count) { var ret = null; if (this.data) { if (this.ownerDocument.implementation.errorChecking && ((offset < 0) || (offset > this.data.length) || (count < 0))) { throw(new DOMException(DOMException.INDEX_SIZE_ERR));}
if (!count) { ret = this.data.substring(offset);}
else { ret = this.data.substring(offset, offset + count);}
}
return ret;}; DOMCharacterData.prototype.appendData = function DOMCharacterData_appendData(arg) { if (this.ownerDocument.implementation.errorChecking && this._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
this.setData(""+ this.data + arg);}; DOMCharacterData.prototype.insertData = function DOMCharacterData_insertData(offset, arg) { if (this.ownerDocument.implementation.errorChecking && this._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
if (this.data) { if (this.ownerDocument.implementation.errorChecking && ((offset < 0) || (offset > this.data.length))) { throw(new DOMException(DOMException.INDEX_SIZE_ERR));}
this.setData(this.data.substring(0, offset).concat(arg, this.data.substring(offset)));}
else { if (this.ownerDocument.implementation.errorChecking && (offset != 0)) { throw(new DOMException(DOMException.INDEX_SIZE_ERR));}
this.setData(arg);}
}; DOMCharacterData.prototype.deleteData = function DOMCharacterData_deleteData(offset, count) { if (this.ownerDocument.implementation.errorChecking && this._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
if (this.data) { if (this.ownerDocument.implementation.errorChecking && ((offset < 0) || (offset > this.data.length) || (count < 0))) { throw(new DOMException(DOMException.INDEX_SIZE_ERR));}
if(!count || (offset + count) > this.data.length) { this.setData(this.data.substring(0, offset));}
else { this.setData(this.data.substring(0, offset).concat(this.data.substring(offset + count)));}
}
}; DOMCharacterData.prototype.replaceData = function DOMCharacterData_replaceData(offset, count, arg) { if (this.ownerDocument.implementation.errorChecking && this._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
if (this.data) { if (this.ownerDocument.implementation.errorChecking && ((offset < 0) || (offset > this.data.length) || (count < 0))) { throw(new DOMException(DOMException.INDEX_SIZE_ERR));}
this.setData(this.data.substring(0, offset).concat(arg, this.data.substring(offset + count)));}
else { this.setData(arg);}
}; DOMText = function(ownerDocument) { this._class = addClass(this._class, "DOMText"); this.DOMCharacterData = DOMCharacterData; this.DOMCharacterData(ownerDocument); this.nodeName = "#text"; this.nodeType = DOMNode.TEXT_NODE;}; DOMText.prototype = new DOMCharacterData; DOMText.prototype.splitText = function DOMText_splitText(offset) { var data, inode; if (this.ownerDocument.implementation.errorChecking) { if (this._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
if ((offset < 0) || (offset > this.data.length)) { throw(new DOMException(DOMException.INDEX_SIZE_ERR));}
}
if (this.parentNode) { data = this.substringData(offset); inode = this.ownerDocument.createTextNode(data); if (this.nextSibling) { this.parentNode.insertBefore(inode, this.nextSibling);}
else { this.parentNode.appendChild(inode);}
this.deleteData(offset);}
return inode;}; DOMText.prototype.toString = function DOMText_toString() { return this.__escapeString(""+ this.nodeValue);}
DOMCDATASection = function(ownerDocument) { this._class = addClass(this._class, "DOMCDATASection"); this.DOMCharacterData = DOMCharacterData; this.DOMCharacterData(ownerDocument); this.nodeName = "#cdata-section"; this.nodeType = DOMNode.CDATA_SECTION_NODE;}; DOMCDATASection.prototype = new DOMCharacterData; DOMCDATASection.prototype.splitText = function DOMCDATASection_splitText(offset) { var data, inode; if (this.ownerDocument.implementation.errorChecking) { if (this._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
if ((offset < 0) || (offset > this.data.length)) { throw(new DOMException(DOMException.INDEX_SIZE_ERR));}
}
if(this.parentNode) { data = this.substringData(offset); inode = this.ownerDocument.createCDATASection(data); if (this.nextSibling) { this.parentNode.insertBefore(inode, this.nextSibling);}
else { this.parentNode.appendChild(inode);}
this.deleteData(offset);}
return inode;}; DOMCDATASection.prototype.toString = function DOMCDATASection_toString() { var ret = ""; ret += "<![CDATA[" + this.nodeValue + "\]\]\>"; return ret;}
DOMComment = function(ownerDocument) { this._class = addClass(this._class, "DOMComment"); this.DOMCharacterData = DOMCharacterData; this.DOMCharacterData(ownerDocument); this.nodeName = "#comment"; this.nodeType = DOMNode.COMMENT_NODE;}; DOMComment.prototype = new DOMCharacterData; DOMComment.prototype.toString = function DOMComment_toString() { var ret = ""; ret += "<!--" + this.nodeValue + "-->"; return ret;}
DOMProcessingInstruction = function(ownerDocument) { this._class = addClass(this._class, "DOMProcessingInstruction"); this.DOMNode = DOMNode; this.DOMNode(ownerDocument); this.target = ""; this.data = ""; this.nodeType = DOMNode.PROCESSING_INSTRUCTION_NODE;}; DOMProcessingInstruction.prototype = new DOMNode; DOMProcessingInstruction.prototype.getTarget = function DOMProcessingInstruction_getTarget() { return this.nodeName;}; DOMProcessingInstruction.prototype.getData = function DOMProcessingInstruction_getData() { return this.nodeValue;}; DOMProcessingInstruction.prototype.setData = function DOMProcessingInstruction_setData(data) { this.setNodeValue(data);}; DOMProcessingInstruction.prototype.setNodeValue = function DOMProcessingInstruction_setNodeValue(data) { if (this.ownerDocument.implementation.errorChecking && this._readonly) { throw(new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR));}
this.nodeValue = new String(data); this.data = this.nodeValue;}; DOMProcessingInstruction.prototype.toString = function DOMProcessingInstruction_toString() { var ret = ""; ret += "<?" + this.nodeName +" "+ this.nodeValue + " ?>"; return ret;}
DOMDocumentFragment = function(ownerDocument) { this._class = addClass(this._class, "DOMDocumentFragment"); this.DOMNode = DOMNode; this.DOMNode(ownerDocument); this.nodeName = "#document-fragment"; this.nodeType = DOMNode.DOCUMENT_FRAGMENT_NODE;}; DOMDocumentFragment.prototype = new DOMNode; DOMDocumentFragment.prototype.toString = function DOMDocumentFragment_toString() { var xml = ""; var intCount = this.getChildNodes().getLength(); for (intLoop = 0; intLoop < intCount; intLoop++) { xml += this.getChildNodes().item(intLoop).toString();}
return xml;}
DOMDocumentType = function() { alert("DOMDocumentType.constructor(): Not Implemented" );}; DOMEntity = function() { alert("DOMEntity.constructor(): Not Implemented" );}; DOMEntityReference = function() { alert("DOMEntityReference.constructor(): Not Implemented");}; DOMNotation = function() { alert("DOMNotation.constructor(): Not Implemented" );}; Strings = new Object()
Strings.WHITESPACE = " \t\n\r"; Strings.QUOTES = "\"'"; Strings.isEmpty = function Strings_isEmpty(strD) { return (strD == null) || (strD.length == 0);}; Strings.indexOfNonWhitespace = function Strings_indexOfNonWhitespace(strD, iB, iE) { if(Strings.isEmpty(strD)) return -1; iB = iB || 0; iE = iE || strD.length; for(var i = iB; i < iE; i++)
if(Strings.WHITESPACE.indexOf(strD.charAt(i)) == -1) { return i;}
return -1;}; Strings.lastIndexOfNonWhitespace = function Strings_lastIndexOfNonWhitespace(strD, iB, iE) { if(Strings.isEmpty(strD)) return -1; iB = iB || 0; iE = iE || strD.length; for(var i = iE - 1; i >= iB; i--)
if(Strings.WHITESPACE.indexOf(strD.charAt(i)) == -1)
return i; return -1;}; Strings.indexOfWhitespace = function Strings_indexOfWhitespace(strD, iB, iE) { if(Strings.isEmpty(strD)) return -1; iB = iB || 0; iE = iE || strD.length; for(var i = iB; i < iE; i++)
if(Strings.WHITESPACE.indexOf(strD.charAt(i)) != -1)
return i; return -1;}; Strings.replace = function Strings_replace(strD, iB, iE, strF, strR) { if(Strings.isEmpty(strD)) return ""; iB = iB || 0; iE = iE || strD.length; return strD.substring(iB, iE).split(strF).join(strR);}; Strings.getLineNumber = function Strings_getLineNumber(strD, iP) { if(Strings.isEmpty(strD)) return -1; iP = iP || strD.length; return strD.substring(0, iP).split("\n").length
}; Strings.getColumnNumber = function Strings_getColumnNumber(strD, iP) { if(Strings.isEmpty(strD)) return -1; iP = iP || strD.length; var arrD = strD.substring(0, iP).split("\n"); var strLine = arrD[arrD.length - 1]; arrD.length--; var iLinePos = arrD.join("\n").length; return iP - iLinePos;}; StringBuffer = function() {this._a=new Array();}; StringBuffer.prototype.append = function StringBuffer_append(d){this._a[this._a.length]=d;}; StringBuffer.prototype.toString = function StringBuffer_toString(){return this._a.join("");}; 

// ============================================================
// 工具函数（来自utilities.js）
// ============================================================
function trim11(str) {
    if (str) {
        str = str.replace(/^\s+/, '');
        for (var i = str.length - 1; i >= 0; i--) {
            if (/\S/.test(str.charAt(i))) {
                str = str.substring(0, i + 1);
                break;
            }
        }
    }
    return str;
}

var absoluteURLStart = /^[a-zA-Z]+:\/\/.*/;
function isRelative(url) { return !url.match(absoluteURLStart); }

function getRootURL(fullURL) {
    var start_from = fullURL.indexOf(".");
    var slash = fullURL.indexOf("/", start_from);
    return (slash > 0 ? fullURL.substring(0, slash) : fullURL);
}

function getParentURL(fullURL, start) {
    var slash = fullURL.lastIndexOf("/");
    return (slash >= (start ? start : 0) ? fullURL.substring(0, slash) : fullURL);
}

function createDate(str) {
    var dat = new Date(str);
    return isNaN(dat.getTime()) ? new Date() : dat;
}

// ============================================================
// Feed解析函数（来自feedWorker.js）
// ============================================================
var xmlNamespace = "http://www.w3.org/XML/1998/namespace";

function getInner(parnt, dflt) {
    if (parnt) {
        if (parnt.textContent) return parnt.textContent;
        if (parnt.firstChild && parnt.firstChild.nodeValue) return parnt.firstChild.nodeValue;
    }
    return dflt;
}

function getFeedItem(itemXML, data) {
    var newItem = {};
    var feed = data.feed;
    var responseFeed = data.response.feed;
    var parentTagName = itemXML.tagName;
    var hrefBase = itemXML.getAttributeNS(xmlNamespace, "base");
    if (hrefBase && isRelative(hrefBase)) {
        hrefBase = (hrefBase.charAt(0) == "/" ? responseFeed.baseURL : responseFeed.parentURL) + "/" + hrefBase;
    }

    var desc = itemXML.getElementsByTagName('description').item(0) || itemXML.getElementsByTagName('content').item(0);
    newItem.description = getInner(desc, "");

    var itemTitle = getInner(itemXML.getElementsByTagName('title').item(0), "Unknown title");
    newItem.title = trim11(itemTitle);
    if (!newItem.title || newItem.title.length < 1) newItem.title = undefined;

    var itemUrls = itemXML.getElementsByTagName('link');
    var itemUrl;
    for (var i = 0; i < itemUrls.length; ++i) {
        var url = itemUrls.item(i);
        if (url.parentNode.tagName == parentTagName) {
            if (!itemUrl) {
                itemUrl = url;
            } else if (url.getAttribute("rel") == "alternate" && url.getAttribute("type") == "text/html") {
                itemUrl = url;
                break;
            }
        }
    }

    if (itemUrl) {
        itemUrl = trim11(itemUrl.getAttribute("href") || getInner(itemUrl, ''));
    } else {
        itemUrl = '';
    }

    if (itemUrl.length < 1) {
        newItem.url = undefined;
    } else if (isRelative(itemUrl)) {
        newItem.url = (itemUrl.charAt(0) == "/" ? feed.baseURL : (hrefBase || feed.parentURL)) + "/" + itemUrl;
    } else {
        newItem.url = itemUrl;
    }

    var pubDate = itemXML.getElementsByTagName('pubDate').item(0);
    if (!(pubDate && pubDate.firstChild)) pubDate = itemXML.getElementsByTagName('updated').item(0);
    newItem.pubDate = getInner(pubDate, new Date());

    var guid = itemXML.getElementsByTagName('guid').item(0);
    var guidStr = trim11(getInner(guid, ''));
    if (!guidStr) {
        guid = itemXML.getElementsByTagName('id').item(0);
        guidStr = trim11(getInner(guid, ''));
    }

    if (guidStr) {
        newItem.guid = guidStr;
    } else if (newItem.title && newItem.url) {
        newItem.guid = newItem.title + newItem.url;
    }

    return newItem;
}

function populateItems(data, doc) {
    var responseFeed = data.response.feed;
    var feed = data.feed;
    responseFeed.updateCycleId = (responseFeed.updateCycleId || 0) + 1;

    var items = doc.getElementsByTagName('entry');
    if (items.length == 0) items = doc.getElementsByTagName('item');

    var newItemGuids = [], newDeletedItems = [], newItemsByGuid = {};
    var additions = 0, deletions = 0, deleteCounts = [], moves = 0, mods = 0;

    for (var i = 0; i < items.length; i++) {
        var newItem = getFeedItem(items.item(i), data);
        if (!newItem.guid || newItemsByGuid[newItem.guid]) continue;

        var oldItem = (feed.itemsByGuid || {})[newItem.guid];
        if (oldItem) {
            if (oldItem.title != newItem.title || oldItem.url != newItem.url || oldItem.description != newItem.description) {
                mods++;
                newItem.modified = true;
                oldItem.title = newItem.title;
                oldItem.url = newItem.url;
                oldItem.description = newItem.description;
            } else {
                oldItem.modified = false;
            }
            oldItem.pubDate = newItem.pubDate;
            oldItem.updateCycleId = responseFeed.updateCycleId;
            oldItem.moved = false;
            oldItem.added = false;
            newItem = oldItem;
        } else {
            ++additions;
            newItem.added = true;
        }
        newItemGuids.push(newItem.guid);
        newItemsByGuid[newItem.guid] = newItem;
    }

    var oldGuids = feed.itemGuids || [];
    for (var i = 0; i < oldGuids.length; i++) {
        var item = (feed.itemsByGuid || {})[oldGuids[i]];
        if (item && item.updateCycleId != responseFeed.updateCycleId) {
            item.deleted = ++deletions;
            newDeletedItems.push(oldGuids[i]);
        }
        deleteCounts[i] = deletions;
    }

    for (var i = 0; i < newItemGuids.length; i++) {
        var newItem = newItemsByGuid[newItemGuids[i]];
        if (!newItem.added) {
            var prevDel = deleteCounts[newItem.position] || 0;
            var movesAbove = 0, myMoveCount = moves;
            for (var j = i - 1; j >= 0 && myMoveCount > 0; --j) {
                var m = newItemsByGuid[newItemGuids[j]];
                if (m.moved) { myMoveCount--; if (m.oldPosition > newItem.position) movesAbove++; }
            }
            if ((newItem.position + additions + movesAbove - prevDel) != i) { newItem.moved = true; moves++; }
        }
        newItem.oldPosition = newItem.position;
        newItem.position = i;
    }

    var changed = additions > 0 || deletions > 0 || moves > 0;
    if (changed) {
        responseFeed.itemsByGuid = newItemsByGuid;
        responseFeed.itemGuids = newItemGuids;
        responseFeed.deletedItems = newDeletedItems;
    }
    responseFeed.stats = { additions, deletions, moves, mods };
    return changed || mods > 0;
}

function parseFeed(txt, feedData, url) {
    try {
        // service worker里没有DOMParser，用内联的tinyxmlw3cdom的DOMImplementation
        var parser = new DOMImplementation();
        var doc = parser.loadXML(txt).getDocumentElement();
        if (!doc) return null;

        if (feedData.txt === txt) return { changed: false, feed: feedData };

        var baseURL = feedData.baseURL || getRootURL(url);
        var data = {
            feed: feedData,
            url: url,
            response: {
                feed: Object.assign({}, feedData, {
                    txt: txt,
                    updateCycleId: feedData.updateCycleId || 0
                })
            }
        };

        // pubDate
        var dateEl = doc.getElementsByTagName("lastBuildDate").item(0) ||
                     doc.getElementsByTagName("updated").item(0) ||
                     doc.getElementsByTagName("pubDate").item(0);
        var dateStr = trim11(getInner(dateEl, ''));
        data.response.feed.pubDate = dateStr ? createDate(dateStr) : new Date();

        // link
        var link = doc.getElementsByTagName("link").item(0);
        if (link && link.parentNode.tagName != "item" && link.parentNode.tagName != "entry") {
            data.response.feed.moreStories = trim11(link.getAttribute("href") || getInner(link, null)) || baseURL;
        } else {
            data.response.feed.moreStories = baseURL;
        }

        // title
        var titleEl = doc.getElementsByTagName("title").item(0);
        if (titleEl && titleEl.firstChild && titleEl.parentNode.tagName != "item" && titleEl.parentNode.tagName != "entry") {
            data.response.feed.feedTitle = trim11(getInner(titleEl, "Unknown Feed"));
        }

        // favicon
        if (!feedData.faviconURL) {
            data.response.feed.faviconURL = getRootURL(data.response.feed.moreStories) + "/favicon.ico";
        }

        // TTL
        var ettl = doc.getElementsByTagName("ttl").item(0);
        data.response.feed.ttl = parseInt(getInner(ettl, "0")) || 0;

        var changed = populateItems(data, doc);
        data.response.feed.changed = changed;
        return { changed, feed: data.response.feed };
    } catch(e) {
        console.error('parseFeed error for ' + url + ': ' + e);
        return null;
    }
}

// ============================================================
// 角标更新
// ============================================================
async function updateBadge() {
    try {
        const allData = await chrome.storage.local.get(null);
        const seenStates = allData['swSeenStates'] || {};
        const maxItems = allData['swMaxItems'] || 10;
        let unseenFeedCount = 0;

        for (const key in allData) {
            if (!key.startsWith('swFeed:')) continue;
            const url = key.substring('swFeed:'.length);

            // 注意：之前这里依赖 `swFetchOK:<url>` 这个key来判断feed是否成功抓取过。
            // 但写入时用的是 feedInfo.url（存feed时的URL字符串），
            // 读取时用的是从 `swFeed:` key名反推出的url——
            // 这两个字符串理论上应该完全一致，但只要有任何细微差异
            // （编码、尾部斜杠等），拼出来的key就会对不上，
            // 导致 swFetchOK 永远读到 undefined，所有feed被误判为"未成功抓取"而跳过。
            // 实测发现所有feed（包括明确抓取成功的）都被这样误跳过了。
            // 修复：不再依赖这个额外的、容易出问题的key，
            // 直接用下面对 feedData 本身有效性的判断来排除抓取失败的feed即可，
            // 这个判断本身已经能正确识别"没有有效内容"的情况。

            const feedData = allData[key];
            if (!feedData || !feedData.txt || !feedData.itemGuids || feedData.itemGuids.length === 0) {
                continue;
            }

            const feedSeen = (url in seenStates) ? (seenStates[url] || {}) : {};
            const guidsToCheck = maxItems > 0 ? feedData.itemGuids.slice(0, maxItems) : feedData.itemGuids;
            const hasUnseen = guidsToCheck.some(guid => {
                const state = feedSeen[guid];
                return (state === undefined || state === null || state < 1);
            });
            if (hasUnseen) unseenFeedCount++;
        }

        console.log('SW updateBadge: unseenFeedCount=' + unseenFeedCount);

        // 与之前记录的角标数字对比，只有"未读数变大"时才提示音，
        // 对应MV2里 setButtonTitle() 中 doBoing = (badgeCount < upds) 的逻辑
        const prevBadgeCount = allData['swBadgeCount'] || 0;
        const shouldPlaySound = unseenFeedCount > prevBadgeCount;
        console.log('SW updateBadge: prevBadgeCount=' + prevBadgeCount
            + ', shouldPlaySound=' + shouldPlaySound
            + ', swPlaySound=' + allData['swPlaySound']
            + ', swMuteSound=' + allData['swMuteSound']
            + ', swSoundFile=' + allData['swSoundFile']);

        if (unseenFeedCount > 0) {
            console.log('SW updateBadge: setting badge text to "' + unseenFeedCount + '"');
            await chrome.action.setBadgeText({ text: String(unseenFeedCount) });
            await chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
        } else {
            console.log('SW updateBadge: clearing badge text (unseenFeedCount=0)');
            await chrome.action.setBadgeText({ text: '' });
        }

        await chrome.storage.local.set({ swBadgeCount: unseenFeedCount });

        if (shouldPlaySound) {
            await playNotificationSound();
        }
    } catch(e) {
        console.error('SW updateBadge error: ' + e);
    }
}

// ============================================================
// 提示音播放（通过offscreen document，因为SW本身无法播放音频）
// ============================================================
let creatingOffscreenDocument = null;
let offscreenReady = false;

async function hasOffscreenDocument() {
    const contexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT']
    });
    return contexts.length > 0;
}

async function ensureOffscreenDocument() {
    // 如果已有就绪的 offscreen 文档，直接返回
    if (offscreenReady && await hasOffscreenDocument()) return;

    // 如果正在创建中，等待完成
    if (creatingOffscreenDocument) {
        await creatingOffscreenDocument;
        return;
    }

    offscreenReady = false;

    // 等待 offscreen 文档就绪的 Promise
    let readyResolve;
    const readyPromise = new Promise(resolve => { readyResolve = resolve; });

    const readyListener = (message) => {
        if (message && message.greeting === 'offscreenReady') {
            offscreenReady = true;
            readyResolve();
        }
    };
    chrome.runtime.onMessage.addListener(readyListener);

    creatingOffscreenDocument = (async () => {
        try {
            // 如果已有关闭中的旧文档，先等它关闭
            if (await hasOffscreenDocument()) {
                await chrome.offscreen.closeDocument().catch(() => {});
            }
            await chrome.offscreen.createDocument({
                url: 'offscreen.html',
                reasons: ['AUDIO_PLAYBACK'],
                justification: 'Play notification sound when RSS feeds have new items'
            });
            // 等待 offscreen.js 加载完毕并发来 ready 信号（最多等3秒）
            const timeout = new Promise(resolve => setTimeout(() => {
                console.warn('SW ensureOffscreenDocument: timeout waiting for offscreen ready');
                resolve();
            }, 3000));
            await Promise.race([readyPromise, timeout]);
        } finally {
            chrome.runtime.onMessage.removeListener(readyListener);
            creatingOffscreenDocument = null;
        }
    })();

    await creatingOffscreenDocument;
}

async function playNotificationSound() {
    try {
        console.log('SW playNotificationSound: called');
        const allData = await chrome.storage.local.get(['swPlaySound', 'swSoundFile', 'swMuteSound']);
        // 默认播放，除非明确关闭了声音开关
        if (allData['swPlaySound'] === false) {
            console.log('SW playNotificationSound: skipped, swPlaySound === false');
            return;
        }
        if (allData['swMuteSound'] === true) {
            console.log('SW playNotificationSound: skipped, swMuteSound === true');
            return;
        }

        const soundFile = allData['swSoundFile'] || 'sounds/boing.mp3';
        console.log('SW playNotificationSound: playing ' + soundFile);

        await ensureOffscreenDocument();
        // 使用 await 确保消息发送成功，如果失败则记录错误
        try {
            await chrome.runtime.sendMessage({
                target: 'offscreen',
                type: 'playSound',
                soundFile: soundFile
            });
            console.log('SW playNotificationSound: message sent to offscreen, response received');
        } catch (e) {
            console.error('SW playNotificationSound: sendMessage to offscreen failed: ' + e);
        }
    } catch (e) {
        console.error('SW playNotificationSound error: ' + e);
    }
}

// ============================================================
// 主刷新逻辑
// ============================================================
async function ensureAllFeedsHaveExpireData(allData) {
    // 检查订阅列表中是否有缺少过期数据的feed并初始化
    const subscriptions = allData['swSubscriptions'];
    if (!subscriptions || !Array.isArray(subscriptions) || subscriptions.length === 0) return false;

    const now = Date.now();
    const saveData = {};
    let needsInit = false;

    for (const sub of subscriptions) {
        if (!sub.url) continue;
        const expireKey = 'swExpire:' + sub.url;
        if (!allData[expireKey] || !allData[expireKey].expire) {
            let expireTime;
            if (sub.refreshTime && sub.refreshTime !== 'TTL') {
                const minutes = parseInt(sub.refreshTime) || 5;
                expireTime = now + minutes * 60 * 1000;
            } else {
                expireTime = now + 60 * 60 * 1000; // TTL默认60分钟
            }
            saveData[expireKey] = {
                expire: expireTime,
                refreshTime: sub.refreshTime || 'TTL',
                name: sub.name || sub.url
            };
            needsInit = true;
        }
    }

    if (needsInit) {
        await chrome.storage.local.set(saveData);
        console.log('SW: initialized ' + Object.keys(saveData).length + ' missing feed expire times');
    }
    return needsInit;
}

async function refreshExpiredFeeds() {
    try {
        // 先确保所有订阅都有过期数据（新增feed或首次启动的情况）
        const allData = await chrome.storage.local.get(null);
        await ensureAllFeedsHaveExpireData(allData);

        // 重新读取（因为上面可能写入了新数据）
        const freshData = await chrome.storage.local.get(null);
        const now = Date.now();
        const expiredFeeds = [];

        for (const key in freshData) {
            if (key.startsWith('swExpire:')) {
                const url = key.substring('swExpire:'.length);
                const info = freshData[key];
                if (info && info.expire && info.expire < now) {
                    expiredFeeds.push({ url, ...info });
                }
            }
        }

        if (expiredFeeds.length === 0) return;
        console.log('SW: refreshing ' + expiredFeeds.length + ' expired feeds');

        let badgeNeedsUpdate = false;


        for (const feedInfo of expiredFeeds) {
            try {
                const response = await fetch(feedInfo.url, { method: 'GET', cache: 'no-cache' });
                if (!response.ok) throw new Error('HTTP ' + response.status);

                const txt = await response.text();
                const feedKey = 'swFeed:' + feedInfo.url;
                const existingFeedData = freshData[feedKey] || {
                    updateCycleId: 0,
                    baseURL: getRootURL(feedInfo.url),
                    parentURL: getParentURL(feedInfo.url, getRootURL(feedInfo.url).length),
                    itemGuids: [],
                    itemsByGuid: {},
                    deletedItems: [],
                    txt: null
                };

                const result = parseFeed(txt, existingFeedData, feedInfo.url);
                if (!result) throw new Error('parse failed');

                // 计算刷新时间：优先使用用户设置的refreshTime
                let refreshTime;
                if (feedInfo.refreshTime === 'TTL') {
                    // TTL模式：使用feed中的TTL值，如果没有则用默认60分钟
                    refreshTime = result.feed.ttl > 0 ? result.feed.ttl : 60;
                } else {
                    // 用户指定了具体的分钟数
                    refreshTime = parseInt(feedInfo.refreshTime);
                    if (isNaN(refreshTime) || refreshTime < 1) refreshTime = 60;
                }

                const saveData = {};
                saveData[feedKey] = result.feed;
                saveData['swExpire:' + feedInfo.url] = {
                    expire: now + refreshTime * 60 * 1000,
                    refreshTime: feedInfo.refreshTime,
                    name: feedInfo.name
                };
                // 标记此feed可被SW成功fetch（用于排除局域网等无法访问的feed）
                saveData['swFetchOK:' + feedInfo.url] = true;
                await chrome.storage.local.set(saveData);

                if (result.changed) {
                    badgeNeedsUpdate = true;
                    console.log('SW: ' + feedInfo.name + ' updated (+' + (result.feed.stats?.additions || 0) + ')');
                    // 标记此feed有新内容，popup打开时会检测到并刷新
                    await chrome.storage.local.set({ ['swHasUpdate:' + feedInfo.url]: true });
                }
            } catch(e) {
                console.warn('SW error for ' + feedInfo.name + ': ' + e.message);
                const saveData = {};
                saveData['swExpire:' + feedInfo.url] = {
                    expire: now + 5 * 60 * 1000,
                    refreshTime: feedInfo.refreshTime,
                    name: feedInfo.name
                };
                await chrome.storage.local.set(saveData);
            }
        }

        // 如果有feed更新了，更新角标
        // 注意：seenStates可能尚未包含新guids的已读状态，这可能导致角标数字偏高
        // 但这是正确的——新feed条目应显示为未读，直到popup打开后同步seenStates
        if (badgeNeedsUpdate) {
            await updateBadge();
        }
    } catch(e) {
        console.error('SW refreshExpiredFeeds error: ' + e);
    }
}

// ============================================================
// 从保存的订阅列表中初始化过期时间
// ============================================================
async function initExpireFromSavedSubscriptions() {
    try {
        const allData = await chrome.storage.local.get(['swSubscriptions']);
        const subscriptions = allData.swSubscriptions;
        if (!subscriptions || !Array.isArray(subscriptions) || subscriptions.length === 0) {
            console.log('SW: no saved subscriptions to init expire times');
            return;
        }

        const now = Date.now();
        const saveData = {};
        let needsInit = false;

        // 读取现有过期数据，只初始化没有 expire 的订阅
        const expireKeys = subscriptions.map(s => 'swExpire:' + s.url);
        const existingData = await chrome.storage.local.get(expireKeys);

        for (const sub of subscriptions) {
            if (!sub.url) continue;
            const expireKey = 'swExpire:' + sub.url;
            const existing = existingData[expireKey];

            // 只有在该订阅还没有过期数据时才初始化
            if (!existing || !existing.expire) {
                let expireTime;
                if (sub.refreshTime && sub.refreshTime !== 'TTL') {
                    const minutes = parseInt(sub.refreshTime) || 5;
                    expireTime = now + minutes * 60 * 1000;
                } else {
                    expireTime = now + 60 * 60 * 1000; // TTL默认60分钟（匹配实际刷新逻辑）
                }

                saveData[expireKey] = {
                    expire: expireTime,
                    refreshTime: sub.refreshTime || 'TTL',
                    name: sub.name || sub.url
                };
                needsInit = true;
            }
        }

        if (needsInit) {
            await chrome.storage.local.set(saveData);
            console.log('SW: initialized ' + Object.keys(saveData).length + ' feed expire times from saved subscriptions');
        } else {
            console.log('SW: all saved subscriptions already have expire data');
        }
    } catch(e) {
        console.error('SW initExpireFromSavedSubscriptions error: ' + e);
    }
}

// ============================================================
// 事件监听
// ============================================================
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install' || details.reason === 'update') {
        chrome.action.setPopup({ popup: 'popup.html' });
    }
    chrome.alarms.create('feedAutoUpdate', { periodInMinutes: 1 });
    // 初始化过期时间，让后台刷新立即生效
    initExpireFromSavedSubscriptions();
});

chrome.runtime.onStartup.addListener(() => {
    chrome.alarms.create('feedAutoUpdate', { periodInMinutes: 1 });
    updateBadge();
    // 从保存的订阅恢复过期时间
    initExpireFromSavedSubscriptions();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'feedAutoUpdate') await refreshExpiredFeeds();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message) return true;

    if (message.greeting === 'loadedWelcomePage') {
        chrome.action.setPopup({ popup: 'popup.html' });
        sendResponse({ status: 'ok' });
    }
    if (message.greeting === 'showUpdatedPage') {
        chrome.action.setPopup({ popup: 'updated.html' });
        chrome.action.openPopup();
    }
    if (message.greeting === 'setPopupToPopup') {
        chrome.action.setPopup({ popup: 'popup.html' });
    }
    if (message.greeting === 'offscreenDone') {
        offscreenReady = false;
        chrome.offscreen.closeDocument().catch(() => {});
        sendResponse({ status: 'ok' });
    }
    // popup保存seenStates到SW
    // 修复：background.js 实际发送的 greeting 是 'saveSeenStates'（带 data + maxItems），
    // 而不是下面 'badgeSeenStatesSynced' 假设的"已经存好了"。
    // 之前没有任何分支处理 'saveSeenStates'，导致 swSeenStates / swMaxItems
    // 永远不会写入 chrome.storage.local，updateBadge() 每次都因为 seenStates 为空而提前返回，
    // 角标因此永远不会由后台刷新触发更新。
    // popup保存声音设置到SW（是否播放/音源文件/是否静音）
    if (message.greeting === 'saveSoundOptions') {
        const saveData = {};
        saveData['swPlaySound'] = message.playSound;
        saveData['swSoundFile'] = message.soundFile;
        saveData['swMuteSound'] = message.muteSound;
        chrome.storage.local.set(saveData).then(() => sendResponse({ status: 'ok' }));
        return true;
    }
    if (message.greeting === 'saveSeenStates') {
        const saveData = {};
        saveData['swSeenStates'] = message.data || {};
        saveData['swMaxItems'] = message.maxItems;
        chrome.storage.local.set(saveData).then(() => {
            return updateBadge();
        }).then(() => {
            sendResponse({ status: 'ok' });
        });
        return true;
    }
    if (message.greeting === 'badgeSeenStatesSynced') {
        // seenStates already saved to chrome.storage.local by background.js
        // just update badge from storage
        updateBadge().then(() => sendResponse({ status: 'ok' }));
        return true;
    }
    // popup保存feed数据到SW
    if (message.greeting === 'saveFeedData') {
        const saveData = {};
        saveData['swFeed:' + message.url] = message.feedData;
        if (message.expireInfo) {
            saveData['swExpire:' + message.url] = message.expireInfo;
        }
        chrome.storage.local.set(saveData).then(() => sendResponse({ status: 'ok' }));
        return true;
    }
    // popup单独保存expire信息到SW（当没有feed数据只有expire变更时）
    if (message.greeting === 'saveFeedExpire') {
        if (message.expireInfo) {
            const saveData = {};
            saveData['swExpire:' + message.url] = message.expireInfo;
            chrome.storage.local.set(saveData).then(() => sendResponse({ status: 'ok' }));
            return true;
        }
        sendResponse({ status: 'ok' });
        return true;
    }
    // popup请求更新角标
    if (message.greeting === 'updateBadge') {
        updateBadge().then(() => sendResponse({ status: 'ok' }));
        return true;
    }

    // options页面保存配置后通知SW刷新过期数据
    if (message.greeting === 'syncAllFeedsExpiry') {
        const subscriptions = message.subscriptions;
        if (subscriptions && Array.isArray(subscriptions)) {
            const saveData = {};
            const now = Date.now();

            for (const sub of subscriptions) {
                if (!sub.url) continue;
                const expireKey = 'swExpire:' + sub.url;

                // 计算下次过期时间
                let expireTime;
                if (sub.refreshTime && sub.refreshTime !== 'TTL') {
                    const minutes = parseInt(sub.refreshTime) || 5;
                    expireTime = now + minutes * 60 * 1000;
                } else {
                    // TTL模式默认用60分钟（实际TTL会在刷新时从feed XML获取）
                    expireTime = now + 60 * 60 * 1000;
                }

                saveData[expireKey] = {
                    expire: expireTime,
                    refreshTime: sub.refreshTime || 'TTL',
                    name: sub.name
                };
            }

            // 持久化订阅列表，供下次Service Worker启动时初始化过期时间
            saveData['swSubscriptions'] = subscriptions;

            // 始终执行存储更新（即使无过期key+空订阅列表，也要清理残留数据）
            const currentUrls = new Set(subscriptions.map(s => s.url));
            chrome.storage.local.get(null).then((allData) => {
                const toDelete = [];
                for (const key in allData) {
                    if (key.startsWith('swFeed:') || key.startsWith('swExpire:')) {
                        const url = key.substring(key.indexOf(':') + 1);
                        if (!currentUrls.has(url)) {
                            toDelete.push(key);
                        }
                    }
                }
                const doSet = () => {
                    chrome.storage.local.set(saveData).then(() => {
                        console.log('SW: synced ' + subscriptions.length + ' feed expiry times from options');
                        if (toDelete.length > 0) {
                            console.log('SW: cleaned ' + toDelete.length + ' stale feed entries');
                        }
                        refreshExpiredFeeds().then(() => {
                            sendResponse({ status: 'ok', synced: subscriptions.length });
                        });
                    });
                };
                if (toDelete.length > 0) {
                    chrome.storage.local.remove(toDelete).then(doSet);
                } else {
                    doSet();
                }
            });
            return true; // 保持通道打开
        }
        sendResponse({ status: 'ok', synced: 0 });
        return true;
    }

    // options页面通知SW重新读取订阅列表
    if (message.greeting === 'resyncFeeds') {
        const subscriptions = message.subscriptions;
        if (subscriptions && Array.isArray(subscriptions)) {
            const saveData = {};
            const now = Date.now();
            const toDelete = [];

            // 先获取已有的key
            chrome.storage.local.get(null).then((allData) => {
                // 标记要删除的旧feed key
                const currentUrls = new Set(subscriptions.map(s => s.url));
                for (const key in allData) {
                    if (key.startsWith('swFeed:') || key.startsWith('swExpire:')) {
                        const url = key.substring(key.indexOf(':') + 1);
                        if (!currentUrls.has(url)) {
                            toDelete.push(key);
                        }
                    }
                }

                for (const sub of subscriptions) {
                    if (!sub.url) continue;
                    const expireKey = 'swExpire:' + sub.url;

                    let expireTime;
                    if (sub.refreshTime && sub.refreshTime !== 'TTL') {
                        const minutes = parseInt(sub.refreshTime) || 5;
                        expireTime = now + minutes * 60 * 1000;
                    } else {
                        expireTime = now + 60 * 60 * 1000;
                    }

                    saveData[expireKey] = {
                        expire: expireTime,
                        refreshTime: sub.refreshTime || 'TTL',
                        name: sub.name
                    };
                }

                // 持久化订阅列表，供下次Service Worker启动时初始化过期时间
                saveData['swSubscriptions'] = subscriptions;

                const keysToRemove = toDelete.length > 0 ? toDelete : undefined;
                const op = keysToRemove
                    ? chrome.storage.local.remove(keysToRemove).then(() => chrome.storage.local.set(saveData))
                    : chrome.storage.local.set(saveData);

                op.then(() => {
                    if (toDelete.length > 0) {
                        console.log('SW: removed ' + toDelete.length + ' stale feed entries');
                    }
                    refreshExpiredFeeds().then(() => {
                        sendResponse({ status: 'ok' });
                    });
                });
            });
            return true;
        }
        sendResponse({ status: 'ok' });
        return true;
    }

    return true;
});