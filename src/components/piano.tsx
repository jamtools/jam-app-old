import React from 'react'
import classnames from 'classnames'

import { Piano as ReactPiano, KeyboardShortcuts, MidiNumbers } from 'react-piano';

import PianoKeyProcessorContext from '../contexts/piano-key-processor-context'

// CSS styles are required in order to render piano correctly. Importing CSS requires
// a CSS loader. Alternatively, copy the CSS file directly from src/styles.css into your <head>.
import 'react-piano/dist/styles.css';

const firstNote = MidiNumbers.fromNote('c3');
const lastNote = MidiNumbers.fromNote('g6');
window.fromNote =  MidiNumbers.fromNote
window.getAttributes =  MidiNumbers.getAttributes

const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: firstNote,
  lastNote: lastNote,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
})

import {Note, MidiNumber} from '../model-interfaces'

type PianoState = {
  heldDownNotes: MidiNumber[],
}

const notes: MidiNumber[] = []

class Piano extends React.PureComponent<any, PianoState> {
  state: PianoState = {
    heldDownNotes: [],
  }

  constructor(props: any) {
    super(props)
    window.setNotes = this.setNotes
  }

  setNotes = (heldDownNotes: MidiNumber[]) => {
    this.setState({heldDownNotes})
  }

  render() {
    const {heldDownNotes} = this.props
    const heldNumbers = heldDownNotes.map(n => n.number - 24)

    return (
      <div style={{height: '300px'}}>
        <ReactPiano
          noteRange={{ first: firstNote, last: lastNote }}
          playNote={(midiNumber: number) => {
            console.log(midiNumber)
          }}
          stopNote={(midiNumber: number) => {
          }}
          width={1000}
          keyboardShortcuts={keyboardShortcuts}
          playbackNotes={heldNumbers}
        />
        <div>
          {heldNumbers.map((midiNumber: MidiNumber) => (
            <span key={midiNumber}>
              {midiNumber}
              <pre>
              {JSON.stringify(MidiNumbers.getAttributes(midiNumber, null, 2))}
              </pre>
            </span>
          ))}
        </div>
      </div>
    )
  }
}

export default Piano
