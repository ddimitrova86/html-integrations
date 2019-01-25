import Position from '@ckeditor/ckeditor5-engine/src/model/position';

import MathmlDataProcessor from './converters/mathmldataprocessor'

import IntegrationModel, { integrationModelProperties } from './core/src/integrationmodel';
import Parser from './core/src/parser';
import Util from './core/src/util';
import Configuration from './core/src/configuration';
import MathML from './core/src/mathml';

// /**
//  * This property contains all CKEditor5 integration instances.
//  * @type {Object}
//  */
// export var instances = {};
// /**
//  * This property contains the current CKEditor5 integration instance,
//  * which is the instance of the active editor.
//  * @class
//  * @type {IntegrationModel}
//  */
// export var currentInstance = null;

/**
 * This class represents the MathType integration for CKEditor5.
 * @extends {IntegrationModel}
 */
export default class CKEditor5Integration extends IntegrationModel {

    constructor( ckeditorIntegrationModelProperties ) {
        /**
         * CKEditor5 Integration.
         *
         * @param {integrationModelProperties} integrationModelAttributes
         */
        super( ckeditorIntegrationModelProperties );

        /**
         * Folder name used for the integration inside CKEditor plugins folder.
         */
        this.integrationFolderName = 'ckeditor_wiris';
    }

    /** @inheritdoc */
    init() {

        super.init();

        const editor = this.editorObject;

        if ( typeof editor.config != 'undefined' && typeof editor.config.get('wiriseditorparameters') != 'undefined') {
            Configuration.update( 'editorParameters', editor.config.get('wiriseditorparameters') );
        }

    }

    /**
     * @inheritdoc
     * @returns {string} - The CKEditor instance language.
     * @override
     */
    getLanguage() {
        // Returns the CKEDitor instance language.
        return this.editorObject.config.get( 'language' );
    }

    /**
     * Adds callbacks to the following CKEditor listeners:
     * - 'focus' - updates the current instance.
     * - 'contentDom' - adds 'doubleclick' callback.
     * - 'doubleclick' - sets to null data.dialog property to avoid modifications for MathType formulas.
     * - 'setData' - parses the data converting MathML into images.
     * - 'afterSetData' - adds an observer to MathType formulas to avoid modifications.
     * - 'getData' - parses the data converting images into selected save mode (MathML by default).
     * - 'mode' - recalculates the active element.
     */
    addEditorListeners() {
        const editor = this.editorObject;

        if ( typeof editor.config.wirislistenersdisabled == 'undefined' ||
            !editor.config.wirislistenersdisabled ) {

            // First editor parsing.
            //editor.setData( Parser.initParse( editor.getData() ) );

            // Maintain currentInstance updated.
            // editor.editing.view.document.on( 'change:isFocused', ( evt, name, value ) => {
            //     WirisPlugin.currentInstance = WirisPlugin.instances[ evt.editor.name ]; // TODO Editor doesn't have a name property in CKEditor5
            // } );

            this.checkElement();

        }
    }

    /**
     * Checks the current container and assign events in case that it doesn't have them.
     * CKEditor replaces several times the element element during its execution,
     * so we must assign the events again to editor element.
     */
    checkElement() {

        const editor = this.editorObject;
        const newElement = editor.sourceElement;



        // const editor = this.editorObject;
        // const elem = document.getElementById('cke_contents_' + editor.name) ?
        //     document.getElementById('cke_contents_' + editor.name) :
        //     document.getElementById('cke_' + editor.name);

        // let newElement;
        // if (editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE) {
        //     newElement = editor.container.$;
        // } else {
        //     newElement = elem.getElementsByTagName('iframe')[0];
        // }

        // let _wrs_int_divIframe = false;
        // if (!newElement) {
        //     // On this case, CKEditor uses a div area instead of and iframe as the editable area. Events must be integrated on the div area.
        //     let dataContainer;
        //     for (let classElementIndex in elem.classList) {
        //         const classElement = elem.classList[classElementIndex];
        //         if (classElement.search('cke_\\d') != -1) {
        //             dataContainer = classElement;
        //             break;
        //         }
        //     }
        //     if (dataContainer) {
        //         newElement = document.getElementById(dataContainer + '_contents');
        //         _wrs_int_divIframe = true;
        //     }
        // }

        // If the element wasn't treated, add the events.
        if ( !newElement.wirisActive ) {
            this.setTarget(newElement);
            this.addEvents();
            // Set the element as treated
            newElement.wirisActive = true;
        }
    }

    /**
     * @inheritdoc
     * @param {HTMLElement} element - HTMLElement target.
     * @param {MouseEvent} event - event which trigger the handler.
     */
    doubleClickHandler(element, event) {
        if (element.nodeName.toLowerCase() == 'img') {
            if (Util.containsClass(element, Configuration.get('imageClassName'))) {
                // Some plugins (image2, image) open a dialog on double click. On formulas
                // doubleclick event ends here.
                if (typeof event.stopPropagation != 'undefined') { // old I.E compatibility.
                    event.stopPropagation();
                } else {
                    event.returnValue = false;
                }
                this.core.getCustomEditors().disable();
                const customEditorAttr = element.getAttribute(Configuration.get('imageCustomEditorName'));
                if (customEditorAttr) {
                    this.core.getCustomEditors().enable(customEditorAttr);
                }
                this.core.editionProperties.temporalImage = element;
                this.openExistingFormulaEditor();
            }
        }
    }

    
    /** @inheritdoc */
    getCorePath() {
        return null; // TODO
    }

    /** @inheritdoc */
    // getSelection() {

    //     this.target.focus();

    //     const selection = editor.editing.view.document.selection;
    //     const clipboardData = new DataTransfer();
    //     const htmlDataProcessor = new HtmlDataProcessor();

    //     clipboardData.setData( 'text/html', htmlDataProcessor.toData(
    //         selection.getFirstRange().getCommonAncestor()
    //     ) );

    //     return clipboardData;

    // }

    /** @inheritdoc */
    callbackFunction() {
        super.callbackFunction();
        this.addEditorListeners();
    }


    /** @inheritdoc */
    insertFormula( focusElement, windowTarget, mathml, wirisProperties ) {
        // const content = Parser.initParse( mathml );
        // const viewFragment = htmlDataProcessor.toView( content ).getChild( 0 );
        // const modelFragment = this.editorObject.data.toModel( viewFragment );
        // this.editorObject.model.insertContent( modelFragment, this.editorObject.model.document.selection );

        // This returns the value returned by the callback function (writer => {...})
        const modelElementNew = this.editorObject.model.change( writer => {

            const core = this.getCore();

            const mathmlDP = new MathmlDataProcessor();

            // "<math>" -> <math>
            const viewFragment = mathmlDP.toView( mathml );
            // <math> -> <math-math>
            const modelElementNew = this.editorObject.data.toModel( viewFragment ).getChild( 0 );

            // The DOM <img> object corresponding to the formula
            if ( core.editionProperties.isNewElement ) {

                let viewSelection = this.editorObject.editing.view.document.selection;

                if ( viewSelection.isCollapsed ) {

                    let modelPosition = this.editorObject.editing.mapper.toModelPosition( viewSelection.getLastPosition() );
                    writer.insert( modelElementNew, modelPosition );

                }

                // TODO returnObject.node should be the <img> node
                //Parser.mathmlToImgObject(windowTarget.document, mathml, wirisProperties, this.language);

            } else {

                const img = core.editionProperties.temporalImage;
                const viewElement = this.editorObject.editing.view.domConverter.domToView( img );
                const modelElementOld = this.editorObject.editing.mapper.toModelElement( viewElement );

                // Insert the new <math-math> and remove the old one
                //const position = this.editorObject.editing.mapper.toModelPosition( viewElement );
                const position = Position._createBefore( modelElementOld );
                writer.insert( modelElementNew, position );
                writer.remove( modelElementOld );

            }

            return modelElementNew;

        } );

        return {
            node: this.editorObject.editing.view.domConverter.viewToDom( this.editorObject.editing.mapper.toViewElement( modelElementNew ) ),
        };

    }

}