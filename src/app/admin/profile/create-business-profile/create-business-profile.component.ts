import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-create-business-profile',
  templateUrl: './create-business-profile.component.html',
  styleUrls: ['./create-business-profile.component.sass']
})
export class CreateBusinessProfileComponent implements OnInit {
  subscription!: Subscription;
  loading = false;
  profileForm!: FormGroup;
  state:boolean = false;

  constructor(
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private service: ProfileService,
  ) {

  }


  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.profileForm = this.fb.group({
      companyEmail: '',
      companyName: '',
      phone: '',
      location: '',
      physicalAddress: '',
      regNo: '',
      website: '',
      entity: '001',
      logo:'',
      createdOn:'',
    });

  }

  profilePhoto: any
  imageSrc: string;
  profile: string | ArrayBuffer;

  onPhotoChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.profilePhoto = reader.result;
        this.profileForm.controls.logo.setValue(this.profilePhoto);
        this.imageSrc = reader.result as string;
        this.profile = reader.result;
      }
      reader.onerror = (error) => {
        console.log(error)
      }
    }
  }

  onSubmit() {
    this.loading = true;
    this.subscription = this.service.addNewProfile(this.profileForm.value).subscribe(res => {
      this.snackbar.showNotification("snackbar-success", "Successful!");
      this.loading = false;
      this.profileForm.reset();
    }, err => {
      this.loading = false;
      this.snackbar.showNotification("snackbar-danger", err);
    })
  }

}
