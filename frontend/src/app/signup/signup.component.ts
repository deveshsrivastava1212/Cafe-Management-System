import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalContant } from '../shared/gloabal-constant';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: any = FormGroup;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalContant.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalContant.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalContant.contactNumberRegex)]],
      password: [null, [Validators.required]],
    })
  }
  handleSubmit() {
    var formData = this.signupForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password
    }
    this.userService.signup(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "");
      this.router.navigate(['/']);
    }, (error) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalContant.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalContant.error);

    })
  }

}
