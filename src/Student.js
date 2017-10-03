import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';

import types from './types';

const studentSource = {
  beginDrag(props) {
    return props;
  },
  canDrag(props, monitor) {
    return Array.isArray(props.student);
  }
}

const studentTarget = {
  drop(props, monitor) {
    console.log("MOVES TO ", props, " FROM ", monitor.getItem());
    monitor.getItem().onMove(
      monitor.getItem().student,
      props.student,
      props.idx,
      monitor.getItem().idx);
    //moveStudent(props.idx);
  },
  canDrop(props, monitor) {
    return monitor.getItem().student[0] !== props.student[0];
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

    return connectDropTarget(connectDragSource(
      <td className='blank' style={{ opacity : isDragging ? 0.5 : 1.0, cursor : 'move', border : isOver && canDrop ? '4px solid green' : '' }}>
        <table>
          <tbody>
          <tr>
            <td className='name' colSpan = '5'>
              { student[0] }
            </td>
          </tr>
          <tr>
            <td className='grade'>&nbsp;</td>
            <td className='grade'>&nbsp;</td>
            <td className='grade'>&nbsp;</td>
            <td className='grade'>&nbsp;</td>
            <td className='grade'>&nbsp;</td>
          </tr>
          <tr>
            <td className='grade'>&nbsp;</td>
            <td className='grade'>&nbsp;</td>
            <td className='grade'>&nbsp;</td>
            <td className='grade'>&nbsp;</td>
            <td className='grade'>&nbsp;</td>
          </tr>
          </tbody>
        </table>
      </td>
    ));
  }

}

export default
  DropTarget(types.STUDENT, studentTarget, targetCollect)(
    DragSource(types.STUDENT, studentSource, sourceCollect)(Student)
  )
;
