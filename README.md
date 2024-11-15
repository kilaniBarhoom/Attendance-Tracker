
## An attendance tacker app

The main idea of this app is to create a cutomized attendance tracker app, to keep track of workers attendances and payments.

## Tech Stack

**Client (Front End):** 

bun
React,
TailwindCSS,
React Hook Form,
Zod,
Nyxb UI,
framer motion,

**Server (Back End):** 

node,
Express js,
mongodb,
Zod,
BcryptJS,
JsonWebToken,
sessions
## Models definitions

- **User**: is the **Worker** that is allowed to access the app, and perform the actions that are allowed to them.
  - **fullNameArabic**`*`: is the full name in arabic name of the user.
    - **fullNameEnglish**`*`: is the full name in english name of the user.
  - **email**: is the email of the user.
  - **phone**: is the phone number of the user.
  - **secondaryPhone**: is the secondary phone number of the user in case primary one is unreachable.
  - **password**`*`: is the password of the user.
  - **active**: is a flag that is set to decide whether the user is allowed to log in or not.
  - **role**: are the different roles that a **User** can have, different roles give the ability to do more or less actions they can perform.
    1. **Spectator**: can only view his own attendances and change his password.
    2. **User**: can view all the payments, attendances, but can't edit anything besides his password.
    3. **Admin**: can do what a **User** can do, and can add new records, but with restricted deletion and editing abilities, where he can't update or delete a user.
    4. **Superadmin**: The highest level of access can do anything.
- **Attendance**: is the record of the work(Worksheet/Timesheet) that is done by the worker.
  - **date**`*`: is the date that the work was done.
  - **status**: either absent or present.
  - **note**: is the note of the attendance.
  - **attendanceTime**: is the time that the users has attended.
  - **leaveTime**: is the time that the user has left.
  - **advancePayment**: is the amount of money that the user got paid as an advance payment on that day.
  - **user**`*`: is the user/worker who this attendance is associated with.
   - **createdBy**`*`: is the user created this attendance.

- **Payment**: is the payment method that is used to pay the **user** at the end of the month.
  - **date**`*`: is the date that this payment made.
  - **amount**`*`: is the amount that is payed.
  - **user**: is an user that this payment is made out to.
- **Session**: is the record of the sessions that are made by the users.
  - **refreshToken**`*`: is the refresh token that is used to generate new access tokens.
  - **user**`*`: is the user that the refresh token is associated with.
  - **expiresAt**`*`: is the date that the refresh token expires.
- `*`Required field
- When a worker gets deleted, all the logs that are associated with that worker are also deleted.
- When a payee gets deleted, all the cheques that are associated with that payee will have its payee set to null.
- When a user logout his refresh token is revoked.
