import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { finalize } from 'rxjs';
import { CourseService } from 'src/app/core/services/course.service';
import { Course } from 'src/app/core/interfaces/course';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-course',
  standalone: true,
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class CourseComponent implements OnInit {
  courses: Course[] = [];
  isLoading: boolean = true;
  currentPage: number = 1;
  totalPages: number = 1;

  // Dependency injection
  authService: AuthService = inject(AuthService);
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  courseService: CourseService = inject(CourseService);

  // Reactive Form with all course filters
  filterForm: FormGroup = new FormGroup({
    search: new FormControl(''),
    mode: new FormControl(''),
    area: new FormControl(''),
    level: new FormControl(''),
    minCost: new FormControl(null),
    maxCost: new FormControl(null),
    duration: new FormControl(''),
    certificate: new FormControl(null),
    teacher: new FormControl(''),
    modules: new FormControl('')
  });

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.getCourses();

      this.filterForm.valueChanges.subscribe(() => {
        this.currentPage = 1;
        this.getCourses();
      });
    }
  }

  getCourses(): void {
    this.isLoading = true;
    const formValues = this.filterForm.value;

    this.courseService
      .getCourses(
        formValues.search,
        formValues.mode,
        formValues.area,
        formValues.level,
        this.currentPage,
        formValues.minCost,
        formValues.maxCost,
        formValues.duration,
        formValues.certificate,
        formValues.teacher,
        formValues.modules
      )
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: Course[]) => {
          this.courses = response.map((course: Course) => {
           const ratings =
              course.comments?.map((comment) => comment.rating) || [];
            const averageRating =
              ratings.length > 0
                ? ratings.reduce(
                    (sum: number, rating: number) => sum + rating,
                    0,
                  ) / ratings.length
                : 0;
            return { ...course, averageRating };
          });
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading courses:', error);
        },
      });
  }

  changePage(newPage: number): void {
    this.currentPage = newPage;
    this.getCourses();
  }
}