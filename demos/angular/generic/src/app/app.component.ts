import { Component, OnInit } from '@angular/core';

// Import common resources.
import * as Generic from 'resources/demos/angular-imports';

// Create the initial editor content.
const editorContent = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>x</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>';

// Copy the editor content before initializing it.
document.getElementById('transform_content').innerHTML = editorContent;

import { wrsInitEditor } from '@wiris/mathtype-generic/wirisplugin-generic.src';

@Component({
  selector: '#editor',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  ngOnInit() {
    // Set the initial editor content
    document.getElementById('htmlEditor').innerHTML = editorContent;
  
    // Load the toolbar and the editable area into const variables to work easy with them
    const editableDiv = document.getElementById('htmlEditor');
    const toolbarDiv = document.getElementById('toolbar');
    // custom toolbar
    const toolbar = '<toolbar removeLinks="true"><tab name=""><section rows="1"><createButton icon="https://i.ibb.co/Jjc3xk1/sum.png" title="Plus"><content><mo mathvariant="bold" mathcolor="#27ae63">+</mo></content></createButton><createButton icon="https://i.ibb.co/Gd436RP/rest.png" title="Minus"><content><mo mathvariant="bold" mathcolor="#16a086">-</mo></content></createButton><createButton icon="https://i.ibb.co/Ttxqhfw/mult.png" title="Multiplication"><content><mo mathvariant="bold" mathcolor="#953ead">&#xD7;</mo></content></createButton><createButton icon="https://i.ibb.co/D57RV4B/division.png" title="Division"><content><mo mathvariant="bold" mathcolor="#c53221">&#xF7;</mo></content></createButton><createButton icon="https://i.ibb.co/C0n1MLT/equal.png" title="Equal"><content><mo mathvariant="bold" mathcolor="#d15504">=</mo></content></createButton><createButton icon="https://i.ibb.co/hHNDbPC/notEqual.png" title="Not equal"><content><mo mathvariant="bold" mathcolor="#f89d0d">&#x2260;</mo></content></createButton><createButton icon="https://i.ibb.co/9GkLxdS/lessThan.png" title="Less than"><content><mo mathvariant="bold" mathcolor="#5d6564">&#x2264;</mo></content></createButton><createButton icon="https://i.ibb.co/d4njMcB/greater-Than.png" title="Greater than"><content><mo mathvariant="bold" mathcolor="#818c8b">&#x2265;</mo></content></createButton><createButton icon="https://i.ibb.co/ydwqnb6/percent.png" title="Percent"><content><mo mathvariant="bold" mathcolor="#ff6440">%</mo></content></createButton></section></tab></toolbar>';
    const integrationParameters = {
      editorParameters : { 'toolbar' : toolbar }
    }

    // Initialyze the editor.
    wrsInitEditor(editableDiv, toolbarDiv, integrationParameters);

    // Add listener on click button to launch updateContent function.
    document.getElementById('btn_update').addEventListener('click', (e) => {
      e.preventDefault();
      Generic.updateContent((window as any).WirisPlugin.Parser.initParse(editableDiv.innerHTML), 'transform_content');      //eslint-disable-line
    });

    // Get an det the wiris editor plugin version
    document.getElementById('version_wiris').innerHTML += (window as any).WirisPlugin.currentInstance.version;
  }

  // Set app title.
  title = 'generic';
 
}
