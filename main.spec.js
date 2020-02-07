describe('main.js', () => {
  describe('calculate()', () => {
    it('validates expression when the first number is invalid', () => {
      spyOn(window, 'updateResult').and.stub()
      calculate('a+3')
      expect(window.updateResult).toHaveBeenCalled()
      expect(window.updateResult).toHaveBeenCalledWith('Expression not recognized')
      expect(window.updateResult).toHaveBeenCalledTimes(1)
    })

    it('validates expression when the second number is invalid', () => {
      spyOn(window, 'updateResult').and.stub()
      calculate('3+a')
      expect(window.updateResult).toHaveBeenCalled()
      expect(window.updateResult).toHaveBeenCalledWith('Expression not recognized')
      expect(window.updateResult).toHaveBeenCalledTimes(1)
    })
    
    it('validates expression when operation is invalid', () => {
      spyOn(window, 'updateResult').and.stub()
      calculate('3_3')
      expect(window.updateResult).toHaveBeenCalled()
        expect(window.updateResult).toHaveBeenCalledWith('Expression not recognized')
      expect(window.updateResult).toHaveBeenCalledTimes(1)
    })

    it('calls add', () => {
      spyOn(Calculator.prototype, 'add')
      calculate('3+4')
      expect(Calculator.prototype.add).toHaveBeenCalledTimes(2)
      expect(Calculator.prototype.add).toHaveBeenCalledWith(3)
      expect(Calculator.prototype.add).toHaveBeenCalledWith(4)
    })

    it('calls subtract', () => {
      const spy = spyOn(Calculator.prototype, 'subtract')
      calculate('3-7')
      expect(spy).toHaveBeenCalled()
      expect(spy).toHaveBeenCalledWith(7)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('calls multiply', () => {
      spyOn(Calculator.prototype, 'multiply')
      calculate('3*8')
      expect(Calculator.prototype.multiply).toHaveBeenCalled()
      expect(Calculator.prototype.multiply).toHaveBeenCalledWith(8)
      expect(Calculator.prototype.multiply).not.toHaveBeenCalledWith(3)
      expect(Calculator.prototype.multiply).toHaveBeenCalledTimes(1)
    })

    it('calls divide', () => {
      spyOn(Calculator.prototype, 'divide')
      calculate('24/6')
      expect(Calculator.prototype.divide).toHaveBeenCalled()
      expect(Calculator.prototype.divide).toHaveBeenCalledWith(6)
      expect(Calculator.prototype.divide).toHaveBeenCalledTimes(1)
    })

    it('calls updateResult (example using and.callThrough)', () => {
      spyOn(window, 'updateResult')
      spyOn(Calculator.prototype, 'multiply').and.callThrough()
      calculate('5*5')
      expect(window.updateResult).toHaveBeenCalled()
      expect(window.updateResult).toHaveBeenCalledWith(25)
    })
    
    it('calls updateResult (example using and.callFake)', () => {
      spyOn(window, 'updateResult')
      spyOn(Calculator.prototype, 'multiply').and.callFake((number) => {
        return 'it works'
      })
      calculate('5*5')
      expect(window.updateResult).toHaveBeenCalled()
      expect(window.updateResult).toHaveBeenCalledWith('it works')
    })
    
    it('calls updateResult (example using and.returnValue)', () => {
      spyOn(window, 'updateResult')
      spyOn(Calculator.prototype, 'multiply').and.returnValue(25);
      calculate('5*5')
      expect(window.updateResult).toHaveBeenCalled()
      expect(window.updateResult).toHaveBeenCalledWith(25)
    })

    it('calls updateResult (example using and.returnValues)', () => {
      spyOn(window, 'updateResult')
      spyOn(Calculator.prototype, 'add').and.returnValues(null, 'whatever add returns')
      calculate('5+5')
      expect(window.updateResult).toHaveBeenCalled()
      expect(window.updateResult).toHaveBeenCalledWith('whatever add returns')
    })

    it('does not handle errors', () => {
      spyOn(Calculator.prototype, 'multiply').and.throwError('some error')
      expect(() => { calculate('5*5') }).toThrowError('some error')
    })
  })

  describe('updateResult()', () => {
    beforeAll(() => {
      const element = document.createElement('div')
      element.setAttribute('id', 'result')
      document.body.appendChild(element)
      this.element = element
    })

    afterAll(() => {
      document.body.removeChild(this.element)
    })

    it('adds resul to DOM element', () => {
      updateResult('5')
      expect(this.element.innerText).toBe('5')
    })
  })

  describe('showVersion()', () => {
    it('calls calculator.version', () => {
      spyOn(window, 'fetch').and.returnValue(Promise.resolve(
        new Response('{ "version": "0.1" }')
      ))
      spyOn(document, 'getElementById').and.returnValue(
        { innerText: null }
      )
      const spy = spyOnProperty(Calculator.prototype, 'version', 'get').and.returnValue(
        Promise.resolve()
      )
      showVersion()
      expect(Object.getOwnPropertyDescriptor(Calculator.prototype, 'version').get).toHaveBeenCalled()
      expect(spy).toHaveBeenCalled()
    })
  })
})
