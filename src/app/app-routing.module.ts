import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'available-mountains', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'available-mountains', loadChildren: './pages/providers/available-mountains/available-mountains.module#AvailableMountainsPageModule' },

  { path: 'course-payment-details', loadChildren: './pages/course-payment-details/course-payment-details.module#CoursePaymentDetailsPageModule' },
  { path: 'ski-courses', loadChildren: './pages/providers/ski-courses/ski-courses.module#SkiCoursesPageModule' },
  { path: 'ski-course-details', loadChildren: './pages/providers/ski-courses/ski-course-details/ski-course-details.module#SkiCourseDetailsPageModule' },
  { path: 'ski-course-edit', loadChildren: './pages/providers/ski-courses/ski-course-edit/ski-course-edit.module#SkiCourseEditPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'provider', loadChildren: './pages/providers/provider/provider.module#ProviderPageModule' },
  { path: 'provider-details', loadChildren: './pages/providers/provider-details/provider-details.module#ProviderDetailsPageModule' },
  { path: 'trip-hill', loadChildren: './pages/providers/provider-details/trip-hill/trip-hill.module#TripHillPageModule' },
  { path: 'show-instructors', loadChildren: './pages/providers/provider/provider-home/show-instructors/show-instructors.module#ShowInstructorsPageModule' },
  { path: 'comments', loadChildren: './pages/comments/comments.module#CommentsPageModule' },
  { path: 'membership-types', loadChildren: './pages/providers/membership-types/membership-types.module#MembershipTypesPageModule' },
  { path: 'membership-type-details', loadChildren: './pages/providers/membership-types/membership-type-details/membership-type-details.module#MembershipTypeDetailsPageModule' },
  { path: 'membership-type-edit', loadChildren: './pages/providers/membership-types/membership-type-edit/membership-type-edit.module#MembershipTypeEditPageModule' },
  { path: 'provider-members', loadChildren: './pages/providers/provider-members/provider-members.module#ProviderMembersPageModule' },
  { path: 'provider-member-edit', loadChildren: './pages/providers/provider-members/provider-member-edit/provider-member-edit.module#ProviderMemberEditPageModule' },
  { path: 'provider-member-details', loadChildren: './pages/providers/provider-members/provider-member-details/provider-member-details.module#ProviderMemberDetailsPageModule' },
  { path: 'ski-courses-registrations', loadChildren: './pages/providers/ski-courses-registrations/ski-courses-registrations.module#SkiCoursesRegistrationsPageModule' },
  { path: 'ski-course-registration-details', loadChildren: './pages/providers/ski-courses-registrations/ski-course-registration-details/ski-course-registration-details.module#SkiCourseRegistrationDetailsPageModule' },
  { path: 'ski-course-registration-edit', loadChildren: './pages/providers/ski-courses-registrations/ski-course-registration-edit/ski-course-registration-edit.module#SkiCourseRegistrationEditPageModule' },
  { path: 'registration-report', loadChildren: './pages/providers/ski-courses-registrations/registration-report/registration-report.module#RegistrationReportPageModule' },
  { path: 'my-levels', loadChildren: './pages/providers/my-levels/my-levels.module#MyLevelsPageModule' },
  { path: 'payment-report', loadChildren: './pages/providers/payment-report/payment-report.module#PaymentReportPageModule' },
  { path: 'administrators', loadChildren: './pages/providers/administrators/administrators.module#AdministratorsPageModule' },
  { path: 'administrator-details', loadChildren: './pages/providers/administrators/administrator-details/administrator-details.module#AdministratorDetailsPageModule' },
  { path: 'administrator-edit', loadChildren: './pages/providers/administrators/administrator-edit/administrator-edit.module#AdministratorEditPageModule' },
  { path: 'ski-instructors', loadChildren: './pages/providers/ski-instructors/ski-instructors.module#SkiInstructorsPageModule' },
  { path: 'ski-instructor-details', loadChildren: './pages/providers/ski-instructors/ski-instructor-details/ski-instructor-details.module#SkiInstructorDetailsPageModule' },
  { path: 'ski-instructor-edit', loadChildren: './pages/providers/ski-instructors/ski-instructor-edit/ski-instructor-edit.module#SkiInstructorEditPageModule' },
  { path: 'provider-course-type', loadChildren: './pages/providers/provider-course-type/provider-course-type.module#ProviderCourseTypePageModule' },
  { path: 'provider-course-type-details', loadChildren: './pages/providers/provider-course-type/provider-course-type-details/provider-course-type-details.module#ProviderCourseTypeDetailsPageModule' },
  { path: 'price-units', loadChildren: './pages/providers/price-units/price-units.module#PriceUnitsPageModule' },
  { path: 'price-unit-details', loadChildren: './pages/providers/price-units/price-unit-details/price-unit-details.module#PriceUnitDetailsPageModule' },
  { path: 'price-unit-edit', loadChildren: './pages/providers/price-units/price-unit-edit/price-unit-edit.module#PriceUnitEditPageModule' },
  { path: 'payment-account', loadChildren: './pages/providers/payment-account/payment-account.module#PaymentAccountPageModule' },
  { path: 'pre-payments', loadChildren: './pages/providers/pre-payments/pre-payments.module#PrePaymentsPageModule' },
  { path: 'pre-payment-edit', loadChildren: './pages/providers/pre-payments/pre-payment-edit/pre-payment-edit.module#PrePaymentEditPageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
  { path: 'profile-edit', loadChildren: './pages/profile/profile-edit/profile-edit.module#ProfileEditPageModule' },
  { path: 'change-password', loadChildren: './pages/profile/change-password/change-password.module#ChangePasswordPageModule' },
  { path: 'change-email', loadChildren: './pages/profile/change-email/change-email.module#ChangeEmailPageModule' },
  { path: 'album', loadChildren: './pages/profile/album/album.module#AlbumPageModule' },
  { path: 'comments-recent', loadChildren: './pages/comments-recent/comments-recent.module#CommentsRecentPageModule' },
  { path: 'feedback', loadChildren: './pages/feedback/feedback.module#FeedbackPageModule' },
  { path: 'membership-payment-details', loadChildren: './pages/membership-payment-details/membership-payment-details.module#MembershipPaymentDetailsPageModule' },
  { path: 'help', loadChildren: './pages/help/help.module#HelpPageModule' },
  { path: 'terms', loadChildren: './pages/terms/terms.module#TermsPageModule' },
  { path: 'mountains', loadChildren: './pages/providers/mountains/mountains.module#MountainsPageModule' },
  { path: 'mountain-details', loadChildren: './pages/providers/mountains/mountain-details/mountain-details.module#MountainDetailsPageModule' },
  { path: 'mountain-edit', loadChildren: './pages/providers/mountains/mountain-edit/mountain-edit.module#MountainEditPageModule' },
  { path: 'add-comment', loadChildren: './pages/comments/add-comment/add-comment.module#AddCommentPageModule' },
  { path: 'session-time', loadChildren: './pages/providers/ski-courses/ski-course-details/session-time/session-time.module#SessionTimePageModule' },
  { path: 'select-registration', loadChildren: './pages/providers/ski-courses/ski-course-details/select-registration/select-registration.module#SelectRegistrationPageModule' },
  { path: 'course-summary', loadChildren: './pages/providers/ski-courses/ski-course-details/course-summary/course-summary.module#CourseSummaryPageModule' },
  { path: 'add-album', loadChildren: './pages/profile/album/add-album/add-album.module#AddAlbumPageModule' },
  { path: 'provider-edit', loadChildren: './pages/providers/provider-edit/provider-edit.module#ProviderEditPageModule' },
  { path: 'cancel-registration-payment', loadChildren: './pages/providers/ski-courses-registrations/cancel-registration-payment/cancel-registration-payment.module#CancelRegistrationPaymentPageModule' },
  { path: 'confirm-email', loadChildren: './pages/confirm-email/confirm-email.module#ConfirmEmailPageModule' },
  { path: 'course-consent', loadChildren: './pages/providers/course-consent/course-consent.module#CourseConsentPageModule' },
  { path: 'consent-view', loadChildren: './pages/providers/consent-view/consent-view.module#ConsentViewPageModule' },
  { path: 'my-favorites', loadChildren: './pages/providers/my-favorites/my-favorites.module#MyFavoritesPageModule' },
  { path: 'question-answers', loadChildren: './pages/providers/question-answers/question-answers.module#QuestionAnswersPageModule' },
  { path: 'question-details', loadChildren: './pages/providers/question-answers/question-details/question-details.module#QuestionDetailsPageModule' },
  { path: 'app-configuration', loadChildren: './pages/admin/app-configuration/app-configuration.module#AppConfigurationPageModule' },
  { path: 'manage-users', loadChildren: './pages/admin/manage-users/manage-users.module#ManageUsersPageModule' },
  { path: 'user-details', loadChildren: './pages/admin/manage-users/user-details/user-details.module#UserDetailsPageModule' },
  { path: 'test-page', loadChildren: './pages/test-page/test-page.module#TestPagePageModule' },
  { path: 'trips', loadChildren: './pages/providers/trips/trips.module#TripsPageModule' },
  { path: 'trip-details', loadChildren: './pages/providers/trips/trip-details/trip-details.module#TripDetailsPageModule' },
  { path: 'trip-edit', loadChildren: './pages/providers/trips/trip-edit/trip-edit.module#TripEditPageModule' },
  { path: 'trip-registration-edit', loadChildren: './pages/providers/trips/trip-registration-edit/trip-registration-edit.module#TripRegistrationEditPageModule' },
  { path: 'trip-registration-details', loadChildren: './pages/providers/trips/trip-registration-details/trip-registration-details.module#TripRegistrationDetailsPageModule' },
  { path: 'choose-course-time', loadChildren: './pages/providers/trips/choose-course-time/choose-course-time.module#ChooseCourseTimePageModule' },
  { path: 'session-times', loadChildren: './pages/providers/session-times/session-times.module#SessionTimesPageModule' },
  { path: 'membership', loadChildren: './pages/providers/provider/provider-home/membership/membership.module#MembershipPageModule' },
  { path: 'schedules', loadChildren: './pages/providers/schedules/schedules.module#SchedulesPageModule' },
  { path: 'schedule-edit', loadChildren: './pages/providers/schedules/schedule-edit/schedule-edit.module#ScheduleEditPageModule' },
  { path: 'schedule-check', loadChildren: './pages/providers/schedules/schedule-check/schedule-check.module#ScheduleCheckPageModule' },
  { path: 'schedule-book', loadChildren: './pages/providers/schedules/schedule-book/schedule-book.module#ScheduleBookPageModule' },
  { path: 'available-schools', loadChildren: './pages/providers/available-schools/available-schools.module#AvailableSchoolsPageModule' },
  { path: 'provider-home', loadChildren: './pages/providers/provider/provider-home/provider-home.module#ProviderHomePageModule' },
  { path: 'course-price-formulas', loadChildren: './pages/providers/course-price-formulas/course-price-formulas.module#CoursePriceFormulasPageModule' },
  { path: 'course-price-formula-edit', loadChildren: './pages/providers/course-price-formulas/course-price-formula-edit/course-price-formula-edit.module#CoursePriceFormulaEditPageModule' },
  { path: 'age-range-options', loadChildren: './pages/providers/age-range-options/age-range-options.module#AgeRangeOptionsPageModule' },
  { path: 'age-range-option-edit', loadChildren: './pages/providers/age-range-options/age-range-option-edit/age-range-option-edit.module#AgeRangeOptionEditPageModule' },
  { path: 'level-options', loadChildren: './pages/providers/level-options/level-options.module#LevelOptionsPageModule' },
  { path: 'level-option-edit', loadChildren: './pages/providers/level-options/level-option-edit/level-option-edit.module#LevelOptionEditPageModule' },

  { path: 'ski-course-registration-confirm', loadChildren: './pages/providers/ski-course-registration-confirm/ski-course-registration-confirm.module#SkiCourseRegistrationConfirmPageModule' },
  { path: 'auto-bio', loadChildren: './pages/providers/auto-bio/auto-bio.module#AutoBioPageModule' },
  { path: 'test-wizard', loadChildren: './pages/test-wizard/test-wizard.module#TestWizardPageModule' },
  { path: 'test-payment', loadChildren: './pages/test-payment/test-payment.module#TestPaymentPageModule' },
  { path: 'course-packages', loadChildren: './pages/providers/course-packages/course-packages.module#CoursePackagesPageModule' },
  { path: 'course-package-edit', loadChildren: './pages/providers/course-packages/course-package-edit/course-package-edit.module#CoursePackageEditPageModule' },
  { path: 'course-package-details', loadChildren: './pages/providers/course-packages/course-package-details/course-package-details.module#CoursePackageDetailsPageModule' },
  { path: 'course-package-registrations', loadChildren: './pages/providers/course-package-registrations/course-package-registrations.module#CoursePackageRegistrationsPageModule' },
  { path: 'course-package-registration-confirm', loadChildren: './pages/providers/course-package-registrations/course-package-registration-confirm/course-package-registration-confirm.module#CoursePackageRegistrationConfirmPageModule' },
  { path: 'package-payment-details', loadChildren: './pages/package-payment-details/package-payment-details.module#PackagePaymentDetailsPageModule' },
  { path: 'course-package-registration-details', loadChildren: './pages/providers/course-package-registrations/course-package-registration-details/course-package-registration-details.module#CoursePackageRegistrationDetailsPageModule' },
  { path: 'course-package-registration-edit', loadChildren: './pages/providers/course-package-registrations/course-package-registration-edit/course-package-registration-edit.module#CoursePackageRegistrationEditPageModule' },

];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
