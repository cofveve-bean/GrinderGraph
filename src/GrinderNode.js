// Modular DOM-based grinder node component
export class GrinderNode {
  constructor({title = 'Grinder', initial = {grind: 5}} = {}){
    this.title = title
    this.state = {grind: initial.grind || 5}
    this.handlers = {}
    this.el = this._build()
  }

  _build(){
    const wrap = document.createElement('div')
    wrap.className = 'grinder-node'

    const title = document.createElement('div')
    title.className = 'title'
    title.textContent = this.title

    const hopper = document.createElement('div')
    hopper.className = 'hopper'
    hopper.textContent = 'Bean Hopper'

    const dialRow = document.createElement('div')
    dialRow.className = 'dial-row'

    const dial = document.createElement('input')
    dial.type = 'range'
    dial.min = 1
    dial.max = 10
    dial.value = this.state.grind
    dial.className = 'dial'

    const dialLabel = document.createElement('label')
    dialLabel.textContent = `Grind: ${dial.value}`

    dial.addEventListener('input', e => {
      this.state.grind = Number(e.target.value)
      dialLabel.textContent = `Grind: ${e.target.value}`
      this.emit('change', {grind: this.state.grind})
    })

    dialRow.appendChild(dialLabel)
    dialRow.appendChild(dial)

    const controls = document.createElement('div')
    controls.className = 'controls'

    const crank = document.createElement('button')
    crank.className = 'btn'
    crank.textContent = 'Crank'
    crank.addEventListener('click', async () => {
      await this._spinAnimation(crank)
      this.emit('grind', {grind: this.state.grind})
      this._flashStatus('Ground!')
    })

    const output = document.createElement('div')
    output.className = 'output-port'
    output.title = 'Output'

    controls.appendChild(crank)
    controls.appendChild(output)

    const status = document.createElement('div')
    status.className = 'status'
    status.textContent = 'Ready'

    wrap.appendChild(title)
    wrap.appendChild(hopper)
    wrap.appendChild(dialRow)
    wrap.appendChild(controls)
    wrap.appendChild(status)

    this._dom = {wrap, dial, dialLabel, crank, output, status}
    return wrap
  }

  _spinAnimation(btn){
    return new Promise(resolve => {
      btn.disabled = true
      const orig = btn.textContent
      btn.textContent = 'Grinding...'
      btn.style.transform = 'rotate(0deg)'
      let rotations = 0
      const step = () => {
        rotations += 20
        btn.style.transform = `rotate(${rotations}deg)`
        if(rotations < 720) requestAnimationFrame(step)
        else {
          btn.style.transform = ''
          btn.textContent = orig
          btn.disabled = false
          resolve()
        }
      }
      requestAnimationFrame(step)
    })
  }

  _flashStatus(text, ms = 900){
    const s = this._dom.status
    const prev = s.textContent
    s.textContent = text
    setTimeout(()=> s.textContent = prev, ms)
  }

  mount(container){
    if(typeof container === 'string') container = document.querySelector(container)
    container.appendChild(this.el)
    return this
  }

  on(event, handler){
    if(!this.handlers[event]) this.handlers[event] = []
    this.handlers[event].push(handler)
    return ()=> this.off(event, handler)
  }

  off(event, handler){
    if(!this.handlers[event]) return
    this.handlers[event] = this.handlers[event].filter(h=>h!==handler)
  }

  emit(event, payload){
    const hs = this.handlers[event] || []
    hs.forEach(h=>{ try{ h(payload) } catch(e){ console.error(e) } })
  }

  getState(){ return {...this.state} }
  setState(s = {}){
    if(s.grind != null){
      this.state.grind = Number(s.grind)
      this._dom.dial.value = this.state.grind
      this._dom.dialLabel.textContent = `Grind: ${this.state.grind}`
    }
  }
}

export default GrinderNode
