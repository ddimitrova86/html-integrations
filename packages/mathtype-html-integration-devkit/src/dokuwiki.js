// TODO: String Manager not loaded -> Move to DokuWiki integration.
function loadStringLatex() {
	return;
    if(_wrs_conf_core_loaded) {
        var _wrs_latex_formula_name = _wrs_stringManager.getString('latex_name_label');
    } else {
        setTimeout(loadStringLatex,100);
    }
}
loadStringLatex();

var _wrs_latex_formula_number = 1;

// TODO: Dokuwiki integration. Use a instance of TextCache class.
// Cache for all MathML withouts translation to LaTex.
var _wrs_int_nonLatexCache = {};


// TODO: To Latex class? To Util? Rename method (not understanding)
/**
 * Returns null if there isn't any item or if it is malformed.
 * Otherwise returns a div DOM node containing the mathml image and the cursor position inside the textarea.
 * @param {Object} textarea DOM Element.
 * @ignore
 */
function wrs_getSelectedLatexItemOnTextarea(textarea) {
    var textNode = document.createTextNode(textarea.value);
    var textNodeWithLatex = Latex.getLatexFromTextNode(textNode, textarea.selectionStart);
    if (textNodeWithLatex == null) {
        return null
    };

    // Try to get latex mathml from cache
    var latex = textNodeWithLatex.latex;
    var mathml = Latex.cache.get(latex);
	// If the formula was written and not generated by the editor, caches won't have the data.
	//TODO: This condition should be !mathml?
    if (mathml) {
        mathml = Latex.getMathMLFromLatex(latex);
    }

    var mathmlWithoutSemantics = removeSemanticsMathml(mathml, "LaTeX");
    var img = Parser.parseMathmlToImg(mathmlWithoutSemantics, _wrs_xmlCharacters, _wrs_int_langCode);
    var div = document.createElement('div');
    div.innerHTML = img;

    return {
        'node': div.firstChild,
        'startPosition': textNodeWithLatex.startPosition,
        'endPosition': textNodeWithLatex.endPosition
    };
}

// TODO: Dokuwiki: Instantiate a TextCache class inside. Don't use globally.
/**
 * Populates Non-LaTeX cache into _wrs_int_nonLatexCache global variable.
 * Non-LaTeX is called to all the mathmls without LaTeX translation.
 *
 * @param {string}latex Non-LaTeX code.
 * @param {string} mathml matml associated.
 * @ignore
 */
function wrs_populateNonLatexCache(latex, mathml) {
    if (!_wrs_int_LatexCache.hasOwnProperty(latex)) {
        _wrs_int_nonLatexCache[latex] = mathml;
    }
}