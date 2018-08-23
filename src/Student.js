import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';

import types from './types';

const studentSource = {
  beginDrag(props) {
    return props;
  },
  canDrag(props, monitor) {
    return Array.isArray(props.student) && props.student[0] && props.idx !== 99;
  }
}

const studentTarget = {
  drop(props, monitor) {
    monitor.getItem().onMove(
      monitor.getItem().student,
      props.student,
      props.idx,
      monitor.getItem().idx);
    //moveStudent(props.idx);
  },
  canDrop(props, monitor) {
    return monitor.getItem().student[0] !== props.student[0] && props.idx !== 99;
  }
}


function sourceCollect(connect, monitor) {
  return {
    connectDragSource : connect.dragSource(),
    isDragging : monitor.isDragging(),
  }
}

function targetCollect(connect, monitor) {
  return {
    connectDropTarget : connect.dropTarget(),
    isOver : monitor.isOver(),
    canDrop : monitor.canDrop()
  }
}


class Student extends Component {

  render() {

    const { connectDragSource, connectDropTarget, isDragging, isOver, canDrop } = this.props;

    const student = this.props.student;
    const idx     = this.props.idx;

    let borderColor = '';

    const rows = {
      one   : 'blue orange orange orange',
      two   : 'yellow blue blue blue',
      three : 'red yellow yellow yellow',
      four  : 'black red red red'
    }

    if (this.props.color_print) {
           if (idx < 6)               { borderColor = rows.one   }
      else if (idx >= 6 && idx < 12)  { borderColor = rows.two   }
      else if (idx >= 12 && idx < 18) { borderColor = rows.three }
      else if (idx >= 18 && idx < 24) { borderColor = rows.four  }
    }
    else if (idx != 99) {
      borderColor = 'black';
    }

    return connectDropTarget(connectDragSource(
      <div className='student-container' style={{ opacity : isDragging ? 0.5 : 1.0, cursor : idx === 99 || student[0] === undefined ? '' : 'move', backgroundColor : isOver && canDrop ? 'lightgreen' : ''}}>
        <div className='student' style={{ borderColor }}>
          <div className='name'>{student[0]}</div>
          { [0,1,2,3,4,5,6,7,8,9].map( (g) => <div className={`grade`} key={g}></div>) }
        </div>
      </div>
    ));
  }

}

export default
  DropTarget(types.STUDENT, studentTarget, targetCollect)(
    DragSource(types.STUDENT, studentSource, sourceCollect)(Student)
  )
;
