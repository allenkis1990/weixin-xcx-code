// component/AddressChoosePicker/AddressChoosePicker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    areaInfo: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        if (newVal.provinces !== undefined || newVal.cities !== undefined) {
          this.resetData()
          if (this.properties.preSelectedIndex.length == 2 || this.properties.preSelectedIndex.length == 3) {
            this.setSelectedDataSource()
          }
        }
      }
    },
    colomNum: {
      type: Number,
      value: 2,
      observer: function (newVal, oldVal) {
        if (this.properties.provinces !== undefined || this.properties.cities !== undefined){
          this.resetData()
          if (this.properties.preSelectedIndex.length == 2 || this.properties.preSelectedIndex.length == 3) {
            this.setSelectedDataSource()
          }
        }
      }
    },
    preSelectedIndex: {
      type: Array,
      value: [0],
      observer: function (newVal, oldVal) {
        if (newVal.length === 3 || newVal.length === 2) {
          this.setSelectedDataSource()
        }
      }
    },
    showValueText: {
      type: String,
      value: '请选择收件地区',
      observer: function (newVal, oldVal) {

      }
    },
    disabledPicker: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        console.log(newVal);
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dataSource: [],
    province: [],
    countys: [],
    citys: [],
    objectMultiArray: [],
    currentIndex: [0, 0],
    preIndex: [0, 0],
    haveSelectedValue: false
  },
  ready: function () {
    let context = this
    if (this.properties.colomNum == 3) {
      context.data.objectMultiArray = [context.data.province, context.data.citys, context.data.countys]
      context.setData({
        objectMultiArray: context.data.objectMultiArray
      })
    } else if (this.properties.colomNum == 2) {
      context.data.objectMultiArray = [context.data.citys, context.data.countys]
      context.setData({
        objectMultiArray: context.data.objectMultiArray
      })
    }

  },
  /**
   * 组件的方法列表
   */
  methods: {
    showPickerAction() {
      this.setData({
        currentIndex: this.data.preIndex.concat()
      })
      if (this.properties.colomNum == 3) {
        if (this.data.province.length) {
          // 选中之前的数据
          this.data.citys = this.data.province[this.data.preIndex[0]].citys
          this.data.countys = this.data.citys[this.data.preIndex[1]].countys
          this.data.objectMultiArray = [this.data.province, this.data.citys, this.data.countys]
          this.setData({
            objectMultiArray: this.data.objectMultiArray
          })
        }
      } else if (this.properties.colomNum == 2) {
        this.data.countys = this.data.citys[this.data.preIndex[0]].countys
        this.data.objectMultiArray = [this.data.citys, this.data.countys]
        this.setData({
          objectMultiArray: this.data.objectMultiArray
        })
      }

    },
    bindMultiPickerChange(event) {
      // 选中值
      if (this.properties.colomNum == 3) {
        let selectedIndex = event.detail.value
        let selectesIdArray = [this.data.province[selectedIndex[0]].idCode, this.data.citys[selectedIndex[1]].idCode, this.data.countys[selectedIndex[2]].idCode]
        let selectedNameArray = [this.data.province[selectedIndex[0]].name, this.data.citys[selectedIndex[1]].name, this.data.countys[selectedIndex[2]].name]
        let showValueString = this.data.province[selectedIndex[0]].name + '-' + this.data.citys[selectedIndex[1]].name + '-' + this.data.countys[selectedIndex[2]].name
        this.setData({
          showValueText: showValueString,
          currentIndex: selectedIndex,
          preIndex: selectedIndex,
          haveSelectedValue: true
        })
        let detailValue = {
          ids: selectesIdArray,
          names: selectedNameArray
        }
        this.triggerEvent('confirmAction', detailValue)
      } else if (this.properties.colomNum == 2) {
        let selectedIndex = event.detail.value
        let selectesIdArray = [this.data.citys[selectedIndex[0]].idCode, this.data.countys[selectedIndex[1]].idCode]
        let selectedNameArray = [this.data.citys[selectedIndex[0]].name, this.data.countys[selectedIndex[1]].name]
        let showValueString = this.data.citys[selectedIndex[0]].name + '-' + this.data.countys[selectedIndex[1]].name
        this.setData({
          showValueText: showValueString,
          currentIndex: selectedIndex,
          preIndex: selectedIndex,
          haveSelectedValue: true
        })
        let detailValue = {
          ids: selectesIdArray,
          names: selectedNameArray
        }
        this.triggerEvent('confirmAction', detailValue)
      }

    },
    bindMultiPickerColumnChange(event) {
      console.log(this.data.currentIndex)
      if (this.properties.colomNum == 3) {
        if (event.detail.column == 0) {
          this.data.citys = this.data.province[event.detail.value].citys
          let cityObject = this.data.citys[0]
          this.data.countys = cityObject.countys
          this.data.objectMultiArray = [this.data.province, this.data.citys, this.data.countys]
          this.setData({
            objectMultiArray: this.data.objectMultiArray
          })
          this.setData({
            currentIndex: [event.detail.value, 0, 0],
          })
        } else if (event.detail.column == 1) {
          this.data.currentIndex[1] = event.detail.value
          this.data.currentIndex[2] = 0
          this.data.countys = this.data.citys[event.detail.value].countys
          this.data.objectMultiArray = [this.data.province,this.data.citys, this.data.countys]
          this.setData({
            objectMultiArray: this.data.objectMultiArray
          })
          this.setData({
            currentIndex: this.data.currentIndex
          })
        }
      } else if (this.properties.colomNum == 2) {

      }
    },
    // 重置数组，把数组转为需要的格式
    resetData() {
      let context = this
      if (this.properties.colomNum == 3) {
        if (this.properties.areaInfo.provinces.length) {
          for (let i = 0; i < this.properties.areaInfo.provinces.length; i++) {
            let provinceObject = this.properties.areaInfo.provinces[i]
            let newProvinceObject = {
              name: provinceObject.provinceName,
              idCode: provinceObject.provinceCode
            }
            let cityArray = []
            for (let j = 0; j < provinceObject.cities.length; j++) {
              let cityObject = provinceObject.cities[j]
              let newCityObject = {
                name: cityObject.cityName,
                idCode: cityObject.cityCode
              }
              let countyArray = []
              for (let k = 0; k < cityObject.districts.length; k++) {
                let countyObject = cityObject.districts[k]
                let newCountyObject = {
                  name: countyObject.districtName,
                  idCode: countyObject.districtCode
                }
                countyArray.push(newCountyObject)
              }
              newCityObject.countys = countyArray
              cityArray.push(newCityObject)
            }
            newProvinceObject.citys = cityArray
            this.data.dataSource.push(newProvinceObject)
          }
          this.setData({
            province: this.data.dataSource,
            citys: this.data.dataSource[0].citys,
            countys: this.data.dataSource[0].citys[0].countys
          })
          context.data.objectMultiArray = [context.data.province, context.data.citys, context.data.countys]
          context.setData({
            objectMultiArray: context.data.objectMultiArray
          })
        }
      } else if (this.properties.colomNum == 2) {
        if (this.properties.areaInfo.cities.length) {
          for (let j = 0; j < this.properties.areaInfo.cities.length; j++) {
            let cityObject = this.properties.areaInfo.cities[j]
            let newCityObject = {
              name: cityObject.cityName,
              idCode: cityObject.cityCode
            }
            let countyArray = []
            for (let k = 0; k < cityObject.districts.length; k++) {
              let countyObject = cityObject.districts[k]
              let newCountyObject = {
                name: countyObject.name,
                idCode: countyObject.id
              }
              countyArray.push(newCountyObject)
            }
            newCityObject.countys = countyArray
            this.data.dataSource.push(newCityObject)
          }

          this.setData({
            citys: this.data.dataSource,
            countys: this.data.dataSource[0].countys
          })
          context.data.objectMultiArray = [context.data.citys, context.data.countys]
          context.setData({
            objectMultiArray: context.data.objectMultiArray
          })
        }
      }

    },
    setSelectedDataSource() {
      // 选中之前的数据
      if (this.properties.colomNum == 3) {
        let provinceObject = this.data.province[this.properties.preSelectedIndex[0]]
        let cityObject = provinceObject.citys[this.properties.preSelectedIndex[1]]
        let countyObject = cityObject.countys[this.properties.preSelectedIndex[2]]
        this.data.citys = this.data.province[this.properties.preSelectedIndex[0]].citys
        this.data.countys = this.data.citys[this.properties.preSelectedIndex[1]].countys
        this.data.objectMultiArray = [this.data.province, this.data.citys, this.data.countys]
        this.data.showValueText = provinceObject.name + '-' + cityObject.name + '-' + countyObject.name
        this.setData({
          objectMultiArray: this.data.objectMultiArray,
          showValueText: this.data.showValueText,
          preIndex: this.properties.preSelectedIndex,
          currentIndex: this.properties.preSelectedIndex.concat(),
          haveSelectedValue: true
        })
      } else if (this.properties.colomNum == 2) {
        if (!this.data.citys.length) {
          return
        }
        let cityObject = this.data.citys[this.properties.preSelectedIndex[0]]
        let countyObject = cityObject.countys[this.properties.preSelectedIndex[1]]
        this.data.countys = this.data.citys[this.properties.preSelectedIndex[0]].countys
        this.data.objectMultiArray = [this.data.citys, this.data.countys]
        this.data.showValueText = cityObject.name + '-' + countyObject.name
        this.setData({
          objectMultiArray: this.data.objectMultiArray,
          showValueText: this.data.showValueText,
          preIndex: this.properties.preSelectedIndex,
          currentIndex: this.properties.preSelectedIndex.concat(),
          haveSelectedValue: true
        })

      }
    }
  }
})
