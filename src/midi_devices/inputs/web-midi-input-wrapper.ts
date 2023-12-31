import {Observable, BehaviorSubject} from 'rxjs'
import {logBefore as log} from '../../Logger'

import {
  InputDevice,
  WebMidiInput,
  MidiEvent,
  InputMessage,
} from '../../types/interfaces'
import {Note} from '../../types/model-interfaces'

export default class WebMidiInputWrapper implements InputDevice {
  heldDownNotes: Array<Note> = []
  observable: BehaviorSubject<InputMessage>
  observer: any

  constructor(private webMidiInput: WebMidiInput) {
    webMidiInput.addListener('noteon', 'all', e => this.noteOn(e))
    webMidiInput.addListener('noteoff', 'all', e => this.noteOff(e))

    this.observable = new BehaviorSubject<InputMessage>({notes: []})
  }

  getCurrentlyHeldDownNotes(): Array<Note> {
    return this.heldDownNotes
  }

  // @log('debug')
  noteOff(e: MidiEvent) {
    const targetNoteNumber = e.note.number
    const index = this.heldDownNotes.findIndex(note => note.number === targetNoteNumber)
    this.heldDownNotes.splice(index, 1)
    this.observable.next({pressed: false, note: e.note, notes: [...this.heldDownNotes]})
  }

  // @log('debug')
  noteOn(e: MidiEvent) {
    this.heldDownNotes.push(e.note)
    this.observable.next({pressed: true, note: e.note, notes: [...this.heldDownNotes]})
  }

  destroy() {
    this.webMidiInput.removeListener()
  }

  getName() {
    return this.webMidiInput.name
  }
}
