import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/gloabal-constant';
import { CategoryComponent } from '../dialog/category/category.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {
  displayedColumns:string[] = ['name','edit'];
  dataSource:any;
  responseMessage:any;

  constructor(private categoryService:CategoryService,
    private dialog:MatDialog,
    private snackbarService:SnackbarService,
    private router:Router) { }

  ngOnInit(): void {
    this.tableData();
  }
    tableData(){
      this.categoryService.getCategorys().subscribe((response:any)=>{
        this.dataSource = new MatTableDataSource(response);
      },(error:any)=>{
        if(error.error?.message){
          this.responseMessage = error.error?.message;
        }
        else{
          this.responseMessage = GlobalConstants.genericError;
          }
          this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
      })
    }
        applyFilter(event:Event){
          const filterValue = (event.target as HTMLInputElement).value;
          this.dataSource.filter = filterValue.trim().toLowerCase();
        }
        handleAddAction(){
          const dialogConfg =new MatDialogConfig();
          dialogConfg.data ={
            action: 'Add'
          }
          dialogConfg.width = "850px";
          const dialogRef = this.dialog.open(CategoryComponent,dialogConfg);
          this.router.events.subscribe(()=>{
          dialogRef.close();
          });
          const sub =dialogRef.componentInstance.onAddCategory.subscribe(
            (response)=>{
              this.tableData();
            }
          )
        }
        handleEditAction(value:any){const dialogConfg =new MatDialogConfig();
          dialogConfg.data ={
            action: 'Edit',
            data:value
          }
          dialogConfg.width = "850px";
          const dialogRef = this.dialog.open(CategoryComponent,dialogConfg);
          this.router.events.subscribe(()=>{
          dialogRef.close();
          });
          const sub =dialogRef.componentInstance.onEditCategory.subscribe(
            (response)=>{
              this.tableData();
            }
          )
        }
        handleDeleteAction(value:any){
          const dialogConfig = new MatDialogConfig();
          dialogConfig.data = {
            message: 'delete'+value.name+'category'
          };
          const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
          const sub = dialogRef.componentInstance.onEmitstatuschange.subscribe((response)=>{
            this.deleteCategory(value.id);
            dialogRef.close();
          })
        }
        deleteCategory(id:any){
          this.categoryService.delete(id).subscribe((response:any)=>{
            this.tableData();
            this.responseMessage = response?.message;
            this.snackbarService.openSnackBar(this.responseMessage,"success");
          },(error:any)=>{
            console.log(error);
            if(error.error?.message){
              this.responseMessage =error.error?.message;
            }
            else{
              this.responseMessage = GlobalConstants.genericError;
            }
            this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);


        })
}}
