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

  static defaultProps = {
    classes : []
  }

  render() {

    const { connectDragSource, connectDropTarget, isDragging, isOver, canDrop } = this.props;

    const student = this.props.student;
    const idx     = this.props.idx;
    const seatsPerRow = this.props.seatsPerRow;

    let borderColor = '';

    const rows = {
      one   : 'blue red red red',
      two   : 'green blue blue blue',
      three : 'yellow green green green',
      four  : 'black yellow yellow yellow'
    }

    const classes = ['student-container', ...this.props.classes];

    if (this.props.populateGutter && idx % 7 === 0) {
      borderColor = 'gray'
    }
    else if (this.props.color_print) {
           if (idx < seatsPerRow)                               { borderColor = rows.one; classes.push('lastRow')   }
      else if (idx >= 1 * seatsPerRow && idx < 2 * seatsPerRow) { borderColor = rows.two   }
      else if (idx >= 2 * seatsPerRow && idx < 3 * seatsPerRow) { borderColor = rows.three }
      else if (idx >= 3 * seatsPerRow)                          { borderColor = rows.four  }
    }
    else if (idx !== 99) {
      borderColor = 'black';
    }

    if (idx % seatsPerRow === seatsPerRow - 1) {
      classes.push("firstStudent")
    }
    else if (idx % seatsPerRow === 0) {
      classes.push("lastStudent")
    }

    return connectDropTarget(connectDragSource(
      <div className={classes.join(' ')} style={{ opacity : isDragging ? 0.5 : 1.0, cursor : idx === 99 || student[0] === undefined ? '' : 'move', backgroundColor : isOver && canDrop ? 'lightgreen' : ''}}>
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
