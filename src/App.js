import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import _ from 'lodash';
import Tipsy from 'react-tipsy';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'react-tipsy/dist/react-tipsy.css';

import Student from './Student';

import './App.css';

const CELLS_PER_SIDE = 7;


class App extends Component {

  state = {
    boy_girl        : true,
    swap_students   : true,
    color_print     : true,
    list            : '',
    class_name      : '',
    date_time       : '',
  }

  saveClass() {
    if (this.state.class_name) {
      localStorage.setItem(
        this.state.class_name,
        JSON.stringify(
          {
            class_name  : this.state.class_name,
            date_time   : this.state.date_time,
            list        : this.state.list,
            boy_girl    : false,
            randomize   : false,
          }
        )
      );

      this.forceUpdate();
    }
  }

  load(class_name) {
    this.setState( JSON.parse(localStorage.getItem(class_name) ) )
  }

  deleteClass(class_name) {
    if (window.confirm(`Really delete ${class_name}?`)) {
      localStorage.removeItem(class_name);
      this.forceUpdate();
    }
  }

  layout(randomize) {
    let students = this.state.list.split(/\r?\n/).map(line => line.split(/\s*;\s*/));

    if (this.state.boy_girl && randomize) {
      students = students.filter(s => s[0]);
      let boys = students.filter( student => student[1].match(/^M/i));
      let girls = students.filter( student => student[1].match(/^F/i));

      if (randomize) {
        boys  = _.shuffle(boys);
        girls = _.shuffle(girls);
      }
      students = [];
      while (girls.length || boys.length) {
        if (girls.length) {
          students.push(girls.shift());
        }
        if (boys.length) {
          students.push(boys.shift());
        }
      }
    }
    else if (randomize) {
      students = students.filter(s => s[0]);
      students = _.shuffle(students);
    }

    const list = students
      //.filter(s => s.length > 1 && s[0].length)
      .map(s => s.join(';')) //${s[0] || ''};${s[1] || ''}`)
      .join("\n")
      .replace(/\n\n+$/, '')
    ;


    this.setState({ list });
  }

  toggle(label) {
    let current = this.state[label];
    this.setState({[label] : !current});
  }

  save(label, value) {
    this.setState({[label] : value});
  }

  moveStudent(movingStudent, targetStudent, to, from) {

    let students = this.state.list.split(/\r?\n/).map(s => s.split(/;/));

    while (to > students.length) {
      students.push([]);
    }
    if (this.state.swap_students) {
      students.splice(from, 1, targetStudent);
      students.splice(to, 1, movingStudent);
    }
    else {
      students.splice(from, 1);
      students.splice(to, 0, movingStudent);
    }

    this.setState({ list : students.map(s => s.join(';')).join("\n") }, this.layout);
  }

  render() {

    var saved_classes = [];
    //for (let c in localStorage) {
    for (let i = 0; i < localStorage.length; i++) {
      saved_classes.push( localStorage.key(i) );
    }


    let students = this.state.list.split(/\r?\n/).map(line => line.split(/\s*;\s*/));
    while (students.length < 24) {
      students.push([]);
    }
    students = students.slice(0,24).reverse();

    return (
      <div className='App'>
        <div id='config'>
          <div className='App-header'>
            <h2>Class room layout</h2>
          </div>

          <div className='container-fluid'>
            <div className='row'>
              <div className='col-lg-12'>
                <b>Instructions:</b>
                <ol>
                  <li>Add a list of students, one student per line. Optionally may list gender after semi-colon. i.e., 'Jim Thomason' or 'Jim Thomason;M'</li>
                  <li>As students are added, they appear on the class layout. Students at the top show up in the front rows at the bottom.</li>
                  <li>Fill in the class name and Time/Days on the right.</li>
                  <li>You can re-arrange students by dragging and dropping them in the interface. Drag one student onto another to move them. No need to edit the list directly!</li>
                  <li>If the "swap students" checkbox is enabled, the students will swap. If it{"'"}s not enabled, then the student will insert before the one it is dropped on. The student dropped on will not move.</li>
                  <li>The color print checkbox toggles coloring for color printers.</li>
                  <li>You can randomize the layout, and optionally choose to do a boy/girl layout. Just click the randomize button.</li>
                  <li>When you are satisfied, click the "Save" button to save it to your computer under the class name.</li>
                </ol>
              </div>
            </div>
            <div className='row'>
              <div className='col-lg-2'>
                <b>Saved Classes</b>
                <ul>
                  { saved_classes.map( (k,v) => {
                    return <li key={k}><a onClick={() => this.load(k) }>{k}</a> <a onClick={() => this.deleteClass(k)} style={{color : 'darkred'}}>[X]</a></li>
                  })}
                </ul>
              </div>
              <div className='col-lg-2' style={{textAlign : 'right', padding : '0px'}}>
                <div>
                  <textarea cols='30' rows = '10' value={this.state.list} onChange={(e) => this.setState({list : e.target.value}, this.layout)}>
                  </textarea>
                </div>
                <div>
                  <button className='btn btn-primary' onClick={() => this.saveClass()}>Save</button>
                </div>
              </div>
              <div className='col-lg-8'>
                <form className='form-horizontal'>
                  <div className='form-group'>
                    <label htmlFor='class_name' className='col-xs-2 control-label'>Class Name</label>
                    <div className='col-xs-10'>
                      <input type='text' className='form-control' id='class_name' placeholder='Class Name' value={this.state.class_name} onChange={(e) => this.save('class_name', e.target.value)} />
                    </div>
                  </div>
                  <div className='form-group'>
                    <label htmlFor='class_name' className='col-xs-2 control-label'>Time/Days</label>
                    <div className='col-xs-10'>
                      <input type='text' className='form-control' id='date_time' placeholder='Time/Days' value={this.state.date_time} onChange={(e) => this.save('date_time', e.target.value)} />
                    </div>
                  </div>
                  <div className='form-group'>
                    <label htmlFor='class_name' className='col-xs-2 control-label'>Swap students</label>
                    <div className='col-xs-10'>
                      <Tipsy content='If checked, will swap students in place when dragging. If unchecked, will insert the dragged student at that spot' placement='bottom' trigger='hover focus touch'>
                        <input type = 'checkbox' id='swap_students' checked={this.state.swap_students} onChange={() => this.toggle('swap_students')} />
                      </Tipsy>
                    </div>
                  </div>
                  <div className='form-group'>
                    <label htmlFor='class_name' className='col-xs-2 control-label'>Color print</label>
                    <div className='col-xs-10'>
                      <Tipsy content='If checked, will print the rows in color' placement='bottom' trigger='hover focus touch'>
                        <input type = 'checkbox' id='swap_students' checked={this.state.color_print} onChange={() => this.toggle('color_print')} />
                      </Tipsy>
                    </div>
                  </div>
                  <div className='form-group' style={{display : 'flex', alignItems : 'center'}}>
                    <label htmlFor='class_name' className='col-xs-offset-8 col-xs-2 control-label'>
                      Girl / Boy <input type = 'checkbox' id='boy_girl' checked={this.state.boy_girl} onChange={() => this.toggle('boy_girl')} /></label>
                    <div className='col-xs-1'>
                      <button type='button' className='btn btn-info' onClick={() => { if (window.confirm("Really randomize layout?")) { this.layout(true) }} }>Randomize</button>
                    </div>
                  </div>
                </form>
                <div>
                  &nbsp;
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className = 'headerGrid'>
          <div>Class: <span style={{fontSize : '70%'}}>{ this.state.class_name }</span></div>
          <div>Time/Days: <span style={{fontSize : '65%', whiteSpace : 'pre'}}>{ this.state.date_time }</span></div>
        </div>

        <div className = 'studentGrid'>
          { students.map( (student, i) => {
            let output = [];
            if ( (i && i % 6 == 0)) {
              output.push( <Student student={[]} key={`${i}n`} idx={99} onMove={ this.moveStudent.bind(this) }/> );
            }
            output.push( <Student student={student ? student : []} key={i} idx={23-i} onMove={ this.moveStudent.bind(this) } color_print={ this.state.color_print }/> );
            if ( (i == 23)) {
              output.push( <Student student={[]} key={`${i}x`} idx={99} onMove={ this.moveStudent.bind(this) }/> );
            }
            return output;
          })}
        </div>

        <div className = 'assignmentsGrid'>
          {[0,1,2,3,4,5,6,7,8,9].map((i) => (<div key={i}></div>))}
        </div>

      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
