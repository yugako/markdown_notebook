Vue.filter('date', time => moment(time).format('DD/MM/YY, HH:mm'))

// New VueJS instance
new Vue({
    name: 'notebook',
  
    // CSS selector of the root DOM element
    el: '#notebook',
  
    // Some data
    data () {
      return {
        // content: 'This is a note',
        notes: JSON.parse(localStorage.getItem('notes')) || [],
        selectedId: localStorage.getItem('selected-id') || null,
        showToolbar: false
      }
    },
  
    // Computed properties
    computed: {
      notePreview () {
        // Markdown rendered to HTML
        return this.selectedNote ? marked(this.selectedNote.content) : ''
      },
      addButtonTitle () {
        return this.notes.length + ' notes(s) already'
      },
      selectedNote () {
          return this.notes.find(note => note.id === this.selectedId)
      },
      sortedNotes () {
          return this.notes.slice()
            .sort((a,b) => a.created - b.created)
            .sort((a,b) => (a.favorite === b.favorite) ? 0 : a.favorite ? -1 : 1)
      },
      linesCount() {
          if(this.selectedNote) {
              return this.selectedNote.content.split(/\r\n|\r|\n/).length
          }
      },
      wordsCount () {
          if(this.selectedNote) {
              let c = this.selectedNote.content

            return c.replace(/\n/g, ' ').replace(/(^\s*)|(\s*$)/gi, '').replace(/\s\s+/gi, ' ').split(' ').length

          }
      },
      charactersCount() {
          if(this.selectedNote) {
              return this.selectedNote.content.split('').length
          }
      }
    },
  
    methods: {
      addNote() {
          const time = Date.now()

          const note = {
              id: String(time),
              title: `Нова нотатка ${this.notes.length + 1}`,
              content: 'Напишіть тут щось...',
              created: time,
              favorite: false,
          }

          this.notes.push(note)

          this.selectNote(note)
      },
      selectNote(note) {
          this.selectedId = note.id
      },
      saveNotes() {
        // Convert to JSON before storing
        localStorage.setItem('notes', JSON.stringify(this.notes))
      },
      removeNote () {
          if(this.selectedNote && confirm('Delete this note?')) {
              const index = this.notes.indexOf(this.selectedNote)
              if(~index) {
                  this.notes.splice(index,1);
              }
          }
      },
      favoriteNote () {
          this.selectedNote.favorite ^=true
      }
    },
    watch: {
        notes: {
            handler: 'saveNotes',
            deep: true
        },
        selectedId(val) {
            localStorage.setItem('selected-id', val)
        }
    }
  })

