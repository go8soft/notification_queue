create database notification_queue encoding = 'UTF8';
\c notification_queue
create table match_notifications (
  id serial primary key,
  match_id text not null,
  is_sent boolean not null default false
);

insert into match_notifications (match_id) values ('123');
