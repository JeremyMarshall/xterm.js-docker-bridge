import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import * as Terminal from 'xterm';

@Component({
  selector: 'app-xterm',
  templateUrl: './xterm.component.html',
  styleUrls: ['./xterm.component.scss']
})
export class XtermComponent implements OnInit {
  // $scope = $scope;
  // $http = $http;
  //$element = $element;

  term;
  protocol;
  socketURL;
  socket1;
  pid;
  optionElements;
  terminalContainer;
  actionElements;
  colsElement;
  rowsElement;
  //$element;

  /*@ngInject*/
  constructor(private $http: Http ) {
    this.$http = $http;
    //this.$element = $element;
  }

  setTerminalSize = () => {
    var cols = parseInt(this.colsElement.value, 10);
    var rows = parseInt(this.rowsElement.value, 10);
    var viewportElement = document.querySelector('.xterm-viewport');
    // var scrollBarWidth = viewportElement.offsetWidth - viewportElement.clientWidth;
    var width = (cols * this.term.charMeasure.width + 20 /*room for scrollbar*/).toString() + 'px';
    var height = (rows * this.term.charMeasure.height).toString() + 'px';

    this.terminalContainer.style.width = width;
    this.terminalContainer.style.height = height;
    this.term.resize(cols, rows);
  }

  ngOnInit() {
    this.terminalContainer = document.getElementById('terminal-container');
    this.actionElements = {
      findNext: document.querySelector('#find-next'),
      findPrevious: document.querySelector('#find-previous')
    }
    this.optionElements = {
      cursorBlink: document.querySelector('#option-cursor-blink'),
      cursorStyle: document.querySelector('#option-cursor-style'),
      scrollback: document.querySelector('#option-scrollback'),
      tabstopwidth: document.querySelector('#option-tabstopwidth'),
      bellStyle: document.querySelector('#option-bell-style')
    };
    this.colsElement = document.getElementById('cols');
    this.rowsElement = document.getElementById('rows');
    this.createTerminal()
    this.colsElement.addEventListener('change', this.setTerminalSize);
    this.rowsElement.addEventListener('change', this.setTerminalSize);

    this.actionElements.findNext.addEventListener('keypress',  (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.term.findNext(this.actionElements.findNext.value);
      }
    });
    this.actionElements.findPrevious.addEventListener('keypress',  (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.term.findPrevious(this.actionElements.findPrevious.value);
      }
    });

    this.optionElements.cursorBlink.addEventListener('change',  () => {
      this.term.setOption('cursorBlink', this.optionElements.cursorBlink.checked);
    });
    this.optionElements.cursorStyle.addEventListener('change',  () => {
      this.term.setOption('cursorStyle', this.optionElements.cursorStyle.value);
    });
    this.optionElements.bellStyle.addEventListener('change',  () => {
      this.term.setOption('bellStyle', this.optionElements.bellStyle.value);
    });
    this.optionElements.scrollback.addEventListener('change',  () => {
      this.term.setOption('scrollback', parseInt(this.optionElements.scrollback.value, 10));
    });
    this.optionElements.tabstopwidth.addEventListener('change',  () => {
      this.term.setOption('tabStopWidth', parseInt(this.optionElements.tabstopwidth.value, 10));
    });
  }

  $postLink() {
    console.log('here');
    ////add event listener to an element
    //$scope.on('click', cb);
    //$scope.on('keypress', cb);
    //
    ////also we can apply jqLite dom manipulation operation on element
    //angular.forEach($element.find('div'), function(elem){console.log(elem)})

  }



  createTerminal = () => {
    // Clean terminal
    while (this.terminalContainer.children.length) {
      this.terminalContainer.removeChild(this.terminalContainer.children[0]);
    }
    this.term = new Terminal({
      cursorBlink: this.optionElements.cursorBlink.checked,
      scrollback: parseInt(this.optionElements.scrollback.value, 10),
      tabStopWidth: parseInt(this.optionElements.tabstopwidth.value, 10)
    });
    Terminal.loadAddon('fit');
    Terminal.loadAddon('attach');

    this.term.on('resize', function (size) {
      if (!this.pid) {
        return;
      }
      var cols = this.size.cols;
      var rows = this.size.rows;
      var url = '/terminals/' + this.pid + '/size?cols=' + cols + '&rows=' + rows;

      fetch(url, {method: 'POST'});
    });

    var protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://';

    this.socketURL = protocol + location.hostname + ((location.port) ? (':' + location.port) : '') + '/terminals/';

    console.log( this.socketURL );

    this.term.open(this.terminalContainer);
    this.term.fit();

    var self = this;

    // fit is called within a setTimeout, cols and rows need this.
    setTimeout(() => {

      console.log('zzz');
      console.log(self);
      self.colsElement.value = self.term.cols;
      self.rowsElement.value = self.term.rows;

      // Set terminal size again to set the specific dimensions on the demo
      self.setTerminalSize();

      fetch('/terminals?cols=' + this.term.cols + '&rows=' + self.term.rows, {method: 'POST'}).then(function (res) {

        res.text().then(function (pid) {

          self.pid = pid;
          self.socketURL += self.pid;

          console.log(self.socketURL);

          self.socket1 = new WebSocket(self.socketURL);
          self.socket1.onopen = self.runRealTerminal;
          self.socket1.onclose = self.runFakeTerminal;
          self.socket1.onerror = self.runFakeTerminal;
        });
      });
    } );
  }

  runRealTerminal = () => {

    this.term.attach(this.socket1);
    this.term._initialized = true;

  }

  runFakeTerminal = (error) => {

    console.log(this.term)

    if (this.term._initialized) {
      return;
    }

    this.term._initialized = true;

    var shellprompt = '$ ';

    this.term.prompt =  () => {
      this.term.write('\r\n' + shellprompt);
    };

    this.term.writeln('Welcome to xterm.js');
    this.term.writeln('This is a local terminal emulation, without a real terminal in the back-end.');
    this.term.writeln('Type some keys and commands to play around.');
    this.term.writeln('');
    this.term.prompt();

    this.term.on('key',  (key, ev) => {
      var printable = (
        !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
      );

      if (ev.keyCode == 13) {
        this.term.prompt();
      } else if (ev.keyCode == 8) {
        // Do not delete the prompt
        if (this.term.x > 2) {
          this.term.write('\b \b');
        }
      } else if (printable) {
        this.term.write(key);
      }
    });

    this.term.on('paste', function (data, ev) {
      this.term.write(data);
    });
  }

}
