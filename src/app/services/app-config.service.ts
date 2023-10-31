import { Injectable } from '@angular/core';
import { AutomatorApiService } from './automator-api.service';

@Injectable()
export class AppConfigService {

  constructor(private automatorapi: AutomatorApiService) { }

  getAutomatorAppConfigDetails(automatorAppId: number) {
    return this.automatorapi.getAutomatorAppConfigDetails(automatorAppId);
  }

  getAutomatorAppVersionDetails(automatorAppId: number) {
    return this.automatorapi.getAutomatorAppVersionDetails(automatorAppId);
  }

  deepDiffMapper = (function () {
    return {
      VALUE_CREATED: 'created',
      VALUE_UPDATED: 'updated',
      VALUE_DELETED: 'deleted',
      VALUE_UNCHANGED: 'unchanged',
      map: function (obj1, obj2) {
        if (this.isFunction(obj1) || this.isFunction(obj2)) {
          throw new Error('Invalid argument. Function given, object expected.');
        }
        if (this.isValue(obj1) || this.isValue(obj2)) {
          return {
            type: this.compareValues(obj1, obj2),
            data: obj1 === undefined ? obj2 : obj1
          };
        }

        const diff = {};
        for (const key in obj1) {
          if (this.isFunction(obj1[key])) {
            continue;
          }

          let value2;
          if (obj2[key] !== undefined) {
            value2 = obj2[key];
          }

          diff[key] = this.map(obj1[key], value2);
        }
        for (const key in obj2) {
          if (
            this.isFunction(obj2[key]) ||
            diff[key] !== undefined
          ) {
            continue;
          }

          diff[key] = this.map(undefined, obj2[key]);
        }

        return diff;
      },
      compareValues: function (value1, value2) {
        if (value1 === value2) {
          return this.VALUE_UNCHANGED;
        }
        if (
          this.isDate(value1) &&
          this.isDate(value2) &&
          value1.getTime() === value2.getTime()
        ) {
          return this.VALUE_UNCHANGED;
        }
        if (value1 === undefined) {
          return this.VALUE_CREATED;
        }
        if (value2 === undefined) {
          return this.VALUE_DELETED;
        }
        return this.VALUE_UPDATED;
      },
      isFunction: function (x) {
        return (
          Object.prototype.toString.call(x) ===
          '[object Function]'
        );
      },
      isArray: function (x) {
        return (
          Object.prototype.toString.call(x) === '[object Array]'
        );
      },
      isDate: function (x) {
        return (
          Object.prototype.toString.call(x) === '[object Date]'
        );
      },
      isObject: function (x) {
        return (
          Object.prototype.toString.call(x) === '[object Object]'
        );
      },
      isValue: function (x) {
        return !this.isObject(x) && !this.isArray(x);
      }
    };
  })();

  compareEnvironments(oldEnvironment, newEnvironment, ignoreFieldList) {
    const configurationList = [];
    let newConfigObj = {};
    let oldConfigObj = {};

    if (newEnvironment) {
      this.addConfigurationItem(
        newEnvironment,
        newConfigObj,
        '',
        ignoreFieldList
      );
    }

    if (oldEnvironment) {
      this.addConfigurationItem(
        oldEnvironment,
        oldConfigObj,
        '',
        ignoreFieldList
      );
    }

    Object.keys(newConfigObj).forEach(k => {
      const keyName = k.split('.').reverse()[0];
      if (newConfigObj[k].isObject) {
        configurationList.push({
          configKey: k,
          isObject: true
        })
      } else {
        configurationList.push({
          configKey: k,
          newConfig: newConfigObj[k].val,
          oldConfig: oldConfigObj[k] ? oldConfigObj[k].val : undefined,
          isChanged: (oldConfigObj[k] ? newConfigObj[k].val !== oldConfigObj[k].val : true) && ignoreFieldList.indexOf(keyName) == -1
        })
      }
      delete oldConfigObj[k]
    })

    Object.keys(oldConfigObj).forEach(k => {
      if (oldConfigObj[k].isObject) {
        configurationList.push({
          configKey: k,
          isObject: true
        })
      } else {
        configurationList.push({
          configKey: k,
          oldConfig: oldConfigObj[k].val,
          isChanged: true && ignoreFieldList.indexOf(k) == -1
        })
      }
    })


    return configurationList;
  }

  addConfigurationItem(configuration, configObj, parentKey, ignoreFieldList) {
    if (Array.isArray(configuration)) {
      configuration.forEach((val, index) => {
        if (Array.isArray(val)) {
          if (parentKey !== '') {
            configObj[parentKey + '.[' + index + ']'] = { isObject: true };
          }
          this.addConfigurationItem(val, configObj, parentKey !== '' ? parentKey + '.[' + index + ']' : '[' + index + ']', ignoreFieldList);
        }
        else if (typeof val == 'object') {
          if (parentKey !== '') {
            configObj[parentKey + '.[' + index + ']'] = { isObject: true };
          }
          this.addConfigurationItem(val, configObj, parentKey !== '' ? parentKey + '.[' + index + ']' : '[' + index + ']', ignoreFieldList);

        } else {
          configObj[parentKey + '.[' + index + ']'] = { val: val };
        }
      })
    }
    else if (typeof configuration == 'object') {
      Object.keys(configuration).forEach(key => {
        if (!configuration[key]) {
          configObj[parentKey !== '' ? parentKey + '.' + key : key] = { val: null };
        } else if (Array.isArray(configuration[key])) {
          if (parentKey !== '') {
            configObj[parentKey + '.' + key] = { isObject: true };
          }
          this.addConfigurationItem(configuration[key], configObj, parentKey !== '' ? parentKey + '.' + key : key, ignoreFieldList);
        }
        else if (typeof configuration[key] == 'object') {
          if (parentKey !== '') {
            configObj[parentKey + '.' + key] = { isObject: true };
          }
          this.addConfigurationItem(configuration[key], configObj, parentKey !== '' ? parentKey + '.' + key : key, ignoreFieldList);

        } else {
          configObj[parentKey !== '' ? parentKey + '.' + key : key] = { val: configuration[key] };
        }
      });
    }

  }

  recucnav(nav, highlight) {
    for (const key in nav) {
      const newName = {
        keyy: key,
        label_type: nav[key].type,
        label_data: nav[key].data
      };
      highlight.push(newName);

      if (this.isObject(nav[key]) && !nav[key].hasOwnProperty('data')) {
        this.recucnav(nav[key], highlight);
      }
    }
  }

  isObject(value) {
    return (
      value && typeof value === 'object' && value.constructor === Object
    );
  }

}
