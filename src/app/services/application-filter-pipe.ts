import { Pipe, PipeTransform } from '@angular/core';
import _ from 'underscore';
@Pipe({
  name: 'appFilter'
})
export class ApplicationFilterPipe implements PipeTransform {
    searchItems : any;
    filteredList : any;
    
    transform(items: any[], searchText: string,field:string='label'): any[] {
        this.filteredList = {};
        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter( it => {
          return it[field].toLowerCase().includes(searchText);
        });
             
        
    }
}