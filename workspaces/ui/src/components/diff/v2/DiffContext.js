import React from 'react';
import {GenericContextFactory} from '../../../contexts/GenericContextFactory';
import events from 'events'
const {
  Context: DiffContext,
  withContext: withDiffContext
} = GenericContextFactory()


export const DiffUIEventEmitter = new events.EventEmitter();
export const DiffUIEventEmitterEvents = {
  'SHOW_EXAMPLE_WHEN_POSSIBLE': 'SHOW_EXAMPLE_WHEN_POSSIBLE',
  'SHOW_SPEC_WHEN_POSSIBLE': 'SHOW_SPEC_WHEN_POSSIBLE',
}

/*
???s
- Will Diffs have a unique ID? hash?
  - Will also need to be grouped by part of the request that pertain to
- Will interpretations have an ID? Or just index?
- How will we group interactions by diffs? Will that be domain's concern?
- Can we ignore a diff? Where does that state have to live?


Map[Diff -> Vector[ApiInteraction]]
- Interpretations computed after selecting diff
 */

class DiffContextStore extends React.Component {

  state = {
    selectedDiff: null,
    exampleInteractions: [],
    currentExampleIndex: 0,
    selectedInterpretation: null,
    selectedInterpretationIndex: null,
  }

  render() {
    const {
      regionNames,
      getDiffsByRegion,
      getInteractionsForDiff,
      interpretationsForDiffAndInteraction,

    } = this.props;

    const setSelectedDiff = (diff) => {

      this.setState({
        selectedDiff: diff,
        exampleInteractions: getInteractionsForDiff(diff),
        currentExampleIndex: 0,
        selectedInterpretation: null,
        selectedInterpretationIndex: null}, () => {

        // setTimeout(() => {
          DiffUIEventEmitter.emit(DiffUIEventEmitterEvents.SHOW_EXAMPLE_WHEN_POSSIBLE)
        // }, 0)
      })
    }
    const setSelectedInterpretation = (interpretation, index) => {
      this.setState({selectedInterpretation: interpretation, selectedInterpretationIndex: index})
    }

    const context = {
      regionNames,
      getDiffsByRegion,

      //selected diff
      selectedDiff: this.state.selectedDiff,
      selectedDiffId: this.state.selectedDiff && this.state.selectedDiff.diffHash,
      setSelectedDiff,

      currentExample: this.state.exampleInteractions[this.state.currentExampleIndex],

      interpretationsForDiffAndInteraction,

      //selected interpretation
      selectedInterpretation: this.state.selectedInterpretation,
      selectedInterpretationIndex: this.state.selectedInterpretationIndex,
      setSelectedInterpretation
      // simulate: approved + selectedInterpretation.commands
    };

    return (
      <DiffContext.Provider value={context}>
        {this.props.children}
      </DiffContext.Provider>
    )
  }
}

export {
  DiffContext,
  withDiffContext,
  DiffContextStore
}