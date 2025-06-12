import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../interfaces/course';
;

/**
 * Service responsible for handling course-related API requests.
 *
 * @service
 * @class CourseService
 */
@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private http = inject(HttpClient);

  /**
   * Fetches courses from the backend using search filters and pagination.
   * @param {string} search - Search term for teacher, company or address
   * @param {string} mode - Course mode (in-person, virtual, hybrid)
   * @param {string} area - Course area (technique, humanities, health)
   * @param {string} level - Course level (beginner, intermediate, advanced)
   * @param {number} currentPage - Current page number for pagination
   * @param {number | null} minCost - Minimum cost filter
   * @param {number | null} maxCost - Maximum cost filter
   * @param {string} duration - Course duration filter
   * @param {boolean | null} certificate - Whether course offers certificate
   * @param {string} teacher - Specific teacher filter
   * @param {string} modules - Comma-separated list of modules
   * @returns {Observable<Course[]>} - Observable containing the list of courses
   */
  getCourses(
    search: string,
    mode: string,
    area: string,
    level: string,
    currentPage: number,
    minCost: number | null = null,
    maxCost: number | null = null,
    duration: string = '',
    certificate: boolean | null = null,
    teacher: string = '',
    modules: string = ''
  ): Observable<Course[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const params: any = {
      search,
      mode,
      area,
      level,
      page: currentPage,
      include: 'comments',
      pagination: 'true'
    };

    if (minCost !== null) params.minCost = minCost;
    if (maxCost !== null) params.maxCost = maxCost;
    if (duration) params.duration = duration;
    if (certificate !== null) params.certificate = certificate.toString();
    if (teacher) params.teacher = teacher;
    if (modules) params.modules = modules;

    return this.http.get<Course[]>(`${environment.baseUrl}/courses`, {
      params,
      headers,
    });
  }
}