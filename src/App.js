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

const CELLS_PER_SIDE = 6;

class App extends Component {

  state = {
    boy_girl        : true,
    swap_students   : true,
    list            : '',
    students        : [],
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
            students    : this.state.students
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
console.log("STUD 1", students);
    const list = students
      //.filter(s => s.length > 1 && s[0].length)
      .map(s => s.join(';')) //${s[0] || ''};${s[1] || ''}`)
      .join("\n")
      .replace(/\n\n+$/, '')
    ;
console.log("STUDENTS, LIST", students, list);
    this.setState({ students, list });
  }

  toggle(label) {
    let current = this.state[label];
    this.setState({[label] : !current});
  }

  save(label, value) {
    this.setState({[label] : value});
  }

  renderCell(student, i) {

    return (
      <Student student={student ? student : []} key={i} idx={i} onMove={ this.moveStudent.bind(this) }/>
    )
  }

  moveStudent(movingStudent, targetStudent, to, from) {
    console.log("MOVES ", movingStudent, to, from);
    let students = this.state.list.split(/\r?\n/);
    while (to > students.length) {
      students.push([]);
    }
    if (this.state.swap_students) {
      students.splice(from, 1, targetStudent.join(';'));
      students.splice(to, 1, movingStudent.join(';'));
    }
    else {
      students.splice(from, 1);
      students.splice(to, 0, movingStudent.join(';'));
    }
    this.setState({ list : students.join("\n") }, this.layout);
  }

  renderRow(students, offset) {


    if (students.length < CELLS_PER_SIDE * 2) {
      const openSeatsLeft = Math.floor(( CELLS_PER_SIDE * 2 - students.length ) / 2);
      for (let i = 0; i < openSeatsLeft; i++) {
        students.unshift('');
      }
    }

    let output = [];

    for (let i = 0; i < CELLS_PER_SIDE; i++) {
      output.push( this.renderCell(i >= students.length ? null : students[i], i + offset) );
    }

    output.push( <td className='blank' key='blank'></td> );

    for (let i = CELLS_PER_SIDE; i < CELLS_PER_SIDE * 2; i++) {
      output.push( this.renderCell(i >= students.length ? null : students[i], i + offset) );
    }

    return <tr>{output}</tr>;
  }

  render() {

    var saved_classes = [];
    //for (let c in localStorage) {
    for (let i = 0; i < localStorage.length; i++) {
      saved_classes.push( localStorage.key(i) );
    }

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
                  <li>forthcoming</li>
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

        <table className='layoutTable'>
          <tbody>
            <tr>
              <th colSpan = '6' style={{borderRight : '0px'}}>Class: <span style={{fontSize : '70%'}}>{ this.state.class_name }</span></th><th style={{borderLeft : '0px'}} colSpan = '7'>Time/Days: <span style={{fontSize : '65%', whiteSpace : 'pre'}}>{ this.state.date_time }</span></th>
            </tr>
            <tr><td className='blank'>&nbsp;</td></tr>

            { this.renderRow( this.state.students.slice(CELLS_PER_SIDE * 4, CELLS_PER_SIDE * 6), CELLS_PER_SIDE * 4) }

            <tr><td className='blank' style={{height : '15px'}}></td></tr>

            { this.renderRow( this.state.students.slice(CELLS_PER_SIDE * 2, CELLS_PER_SIDE * 4), CELLS_PER_SIDE * 2) }
            <tr><td className='blank' style={{height : '15px'}}></td></tr>

            { this.renderRow( this.state.students.slice(0, CELLS_PER_SIDE * 2), 0) }
            <tr><td className='blank' style={{height : '15px'}}></td></tr>

            <tr>
              <td colSpan = '2' className='underline'>&nbsp;</td>
              <td className='blank' colSpan = '2'>&nbsp;</td>
              <td colSpan = '2' className='underline'>&nbsp;</td>
              <td className='blank'>&nbsp;</td>
              <td colSpan = '2' className='underline'>&nbsp;</td>
              <td className='blank' colSpan = '2'>&nbsp;</td>
              <td colSpan = '2' className='underline'>&nbsp;</td>
            </tr>
            <tr>
              <td colSpan = '2' className='underline'>&nbsp;</td>
              <td className='blank' colSpan = '2'>&nbsp;</td>
              <td colSpan = '2' className='underline'>&nbsp;</td>
              <td className='blank'>&nbsp;</td>
              <td colSpan = '2' className='underline'>&nbsp;</td>
              <td className='blank' colSpan = '2'>&nbsp;</td>
              <td colSpan = '2' className='underline'>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
