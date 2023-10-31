import { Pipe, PipeTransform } from '@angular/core';
import _ from 'underscore';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
    searchItems : any;
    filteredList : any;
    
    transform(items: any[], searchText: string): any[] {
        this.filteredList = {};
        if (!items) return [];
        if (!searchText) return items;
        // Returns single Object on the basis of search

        // this.searchItems = Object.keys(items);
        // searchText = searchText.toLowerCase();
        // let searchedTextItems = this.searchItems.filter( it => {
        //       return it.toLowerCase().includes(searchText);
        //     });

        //   for (var key in searchedTextItems) {
        //       if (items.hasOwnProperty(searchedTextItems[key])) {
        //           this.filteredList[searchedTextItems[key]] = items[searchedTextItems[key]];
        //       }
        //   }
        // return this.filteredList;

        // Return Individual item inside the object on the basis of search
        searchText = searchText.toLowerCase();
        return items.filter( it => {
          return it.label.toLowerCase().includes(searchText);
        });
        // for(var key in items){
        //  let array = Object.keys(items[key])
        //    let item = array.filter(it => {
        //      return it.toLowerCase().includes(searchText);
        //    })
        //    if(item.length > 0)
        //    for(var i =0;i<item.length;i++){
        //      if(!this.filteredList.hasOwnProperty(key))
        //       this.filteredList[key] = {}

        //      this.filteredList[key][item[0]] = items[key][item[i]];
        //    }
        
        // }
        //return this.filteredList;
             
        
    }
}

// import { Pipe, PipeTransform } from '@angular/core';
// import _ from 'underscore';
// @Pipe({
//   name: 'filter'
// })
// export class FilterPipe implements PipeTransform {
//     searchItems : any;
//     filteredList : any;
    
//     transform(items: any[], searchText: string): any[] {
//         this.filteredList = {};
//         if (!items) return [];
//         if (!searchText) return items;
//         this.searchItems = Object.keys(items);
//         searchText = searchText.toLowerCase();
//         let searchedTextItems = this.searchItems.filter( it => {
//               return it.toLowerCase().includes(searchText);
//             });
//           for (var key in searchedTextItems) {
//               if (items.hasOwnProperty(searchedTextItems[key])) {
//                   this.filteredList[searchedTextItems[key]] = items[searchedTextItems[key]];
//               }
//           }
//         return this.filteredList;
//         // return items.filter(it => {
//         //     console.log(it);
//         //     return it.toLowerCase().includes(searchText);
//         // });

        
//     }
// }