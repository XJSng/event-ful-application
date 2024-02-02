-- Create ORGANISER TABLE
CREATE table organiser (
    organiser_id INT unsigned auto_increment primary key,
    name VARCHAR(100) NOT NULL,
    contact_number INT unsigned NOT NULL,
    email VARCHAR(320) NOT NULL
) engine = innodb;
-- TEMPLATE ORGANISER
insert into organiser (name, contact_number, email)
values ("MeetMe Pte Ltd", 92359235, "meetme@gemail.com"),
    ("Community", 81189229, "community@gemail.com"),
    (
        "Foreign Lander",
        87561234,
        "foreignlander@gemail.com"
    );
-- Create PARTICIPANT TABLE
CREATE table participant (
    participant_id INT unsigned auto_increment primary key,
    name VARCHAR(100) NOT NULL,
    contact_number INT unsigned NOT NULL,
    email VARCHAR(320) NOT NULL
) engine = innodb;
-- TEMPLATE PARTICIPANT
insert into participant (name, contact_number, email)
values ("John Doe", 92359235, "johndoe@gemail.com"),
    ("Peter Tan", 81189229, "community@gemail.com"),
    ("Jane Chua", 99988877, 'janechua@gemail.com'),
    ('Alice Lim', 62605588, 'alicelim@gemail.com') -- Create EVENT TABLE 
    CREATE table event (
        event_id INT unsigned auto_increment primary key,
        title VARCHAR(150) NOT NULL,
        date_time DATETIME NOT NULL,
        location VARCHAR(100) NOT NULL
    ) engine = innodb;
-- ADDING ORGANISER FK TO EVENT
alter table event
add column organiser_id int unsigned;
alter table event
add constraint fk_event_organiser foreign key (organiser_id) references organiser(organiser_id);
-- ADDING participant FK to EVENT
alter table event
add column participant_id int unsigned;
alter table event
add constraint fk_event_participant foreign key (participant_id) references participant(participant_id);
-- TEMPLATE EVENT
insert into event (
        title,
        date_time,
        location,
        organiser_id,
        participant_id
    )
values (
        "Community Meeting @ Queenstown",
        "2024-02-17 16:00:00",
        "Queenstown CC",
        2,
        1
    ),
    (
        "Community Meeting @ Queenstown",
        "2024-02-17 16:00:00",
        "Queenstown CC",
        2,
        2
    ),
    (
        "Meatme @ Bedok",
        "2024-03-12 12:00:00",
        "Heartbeat @ Bedok",
        1,
        3
    ),
    (
        "Meatme @ Bedok",
        "2024-03-12 12:00:00",
        "Heartbeat @ Bedok",
        1,
        4
    ),
    (
        "Expats Unite",
        "2024-03-23 18:30:00",
        "Punggol",
        3,
        1
    ),
    (
        "Expats Unite",
        "2024-03-23 18:30:00",
        "Punggol",
        3,
        4
    );
-- Create REGISTRATION TABLE
CREATE table registration (
    registration_id INT unsigned auto_increment primary key,
    registration_date DATETIME NOT NULL
) engine = innodb;
insert into registration (registration_date, event_id, participant_id)
values ("2024-01-31 17:53:10", 1, 1),
    ("2024-02-02 12:55:54", 2, 2),
    ("2024-02-03 11:32:30", 3, 3),
    ("2024-02-03 11:33:40", 4, 4),
    ("2024-03-01 17:03:43", 5, 1),
    ("2024-03-05 15:43:32", 6, 4);
-- ADDING participant FK to REGISTRATION
alter table registration
add column participant_id int unsigned;
alter table registration
add constraint fk_participant_registration foreign key (participant_id) references participant(participant_id);
-- ADDING event FK to REGISTRATION
alter table registration
add column event_id int unsigned;
alter table registration
add constraint fk_event_registration foreign key (event_id) references event(event_id);
-- Create PAYMENT TABLE
CREATE TABLE payment (
    payment_id INT UNSIGNED auto_increment primary key,
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    amount INT UNSIGNED NOT NULL
) engine = innodb;
-- ADDING event FK to PAYMENT
alter table payment
add column event_id int unsigned;
alter table payment
add constraint fk_event_payment foreign key (event_id) references event(event_id);
-- ADDING participant FK to PAYMENT
alter table payment
add column participant_id int unsigned;
alter table payment
add constraint fk_participant_payment foreign key (participant_id) references participant(participant_id);
-- TEMPLATE PAYMENT
insert into payment (
        transaction_date,
        transaction_type,
        amount,
        event_id,
        participant_id
    )
values ("2024-01-31", "VISA", 25, 1, 1),
    ("2024-02-03", "NETS", 25, 2, 2),
    ("2024-02-03", "FREE", 0, 3, 3),
    ("2024-02-03", "FREE", 0, 4, 4),
    ("2024-03-01", "MASTERCARD", 100, 5, 1),
    ("2024-03-05", "MASTERCARD", 100, 6, 4);
-- For dropping table
alter table event drop column payment_id