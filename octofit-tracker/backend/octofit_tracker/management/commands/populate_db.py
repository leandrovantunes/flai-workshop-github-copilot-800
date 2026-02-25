from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Clear existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Cleared existing data.')

        # Create users (superheroes)
        users = [
            User(email='ironman@avengers.com', name='Tony Stark', age=40, password='jarvis123'),
            User(email='spiderman@avengers.com', name='Peter Parker', age=22, password='spidey123'),
            User(email='thor@avengers.com', name='Thor Odinson', age=1500, password='mjolnir123'),
            User(email='batman@dcheroes.com', name='Bruce Wayne', age=38, password='alfred123'),
            User(email='superman@dcheroes.com', name='Clark Kent', age=35, password='krypton123'),
            User(email='wonderwoman@dcheroes.com', name='Diana Prince', age=3000, password='themyscira123'),
        ]
        for user in users:
            user.save()
        self.stdout.write(f'Created {len(users)} users.')

        # Create teams
        marvel_members = ['Tony Stark', 'Peter Parker', 'Thor Odinson']
        dc_members = ['Bruce Wayne', 'Clark Kent', 'Diana Prince']

        team_marvel = Team(name='Team Marvel', members=marvel_members)
        team_marvel.save()

        team_dc = Team(name='Team DC', members=dc_members)
        team_dc.save()

        self.stdout.write('Created 2 teams (Team Marvel, Team DC).')

        # Create activities
        activities = [
            Activity(user='Tony Stark', activity_type='Iron Man Flight Training', duration='60 minutes', date=date(2024, 1, 10)),
            Activity(user='Peter Parker', activity_type='Web Slinging', duration='45 minutes', date=date(2024, 1, 11)),
            Activity(user='Thor Odinson', activity_type='Hammer Throwing', duration='90 minutes', date=date(2024, 1, 12)),
            Activity(user='Bruce Wayne', activity_type='Martial Arts Training', duration='120 minutes', date=date(2024, 1, 10)),
            Activity(user='Clark Kent', activity_type='Super Speed Running', duration='30 minutes', date=date(2024, 1, 11)),
            Activity(user='Diana Prince', activity_type='Lasso Combat Training', duration='75 minutes', date=date(2024, 1, 12)),
        ]
        for activity in activities:
            activity.save()
        self.stdout.write(f'Created {len(activities)} activities.')

        # Create leaderboard
        leaderboard_entries = [
            Leaderboard(user='Thor Odinson', score=9500),
            Leaderboard(user='Diana Prince', score=9200),
            Leaderboard(user='Tony Stark', score=8800),
            Leaderboard(user='Bruce Wayne', score=8600),
            Leaderboard(user='Clark Kent', score=8400),
            Leaderboard(user='Peter Parker', score=7900),
        ]
        for entry in leaderboard_entries:
            entry.save()
        self.stdout.write(f'Created {len(leaderboard_entries)} leaderboard entries.')

        # Create workouts
        workouts = [
            Workout(
                name='Iron Man Endurance',
                description='High-intensity cardio workout inspired by Tony Stark power suit training.',
                duration='60 minutes',
            ),
            Workout(
                name='Spider Agility',
                description='Flexibility and agility drills based on Spider-Man\'s acrobatic movements.',
                duration='45 minutes',
            ),
            Workout(
                name='Thunder God Strength',
                description='Heavy lifting and power training inspired by Thor\'s legendary strength.',
                duration='90 minutes',
            ),
            Workout(
                name='Dark Knight Discipline',
                description='Mixed martial arts and stealth training modeled after Batman\'s regimen.',
                duration='120 minutes',
            ),
            Workout(
                name='Kryptonian Speed',
                description='Sprint intervals and reaction drills inspired by Superman\'s super speed.',
                duration='30 minutes',
            ),
            Workout(
                name='Amazonian Warrior',
                description='Combat conditioning and strength training based on Wonder Woman\'s Amazonian training.',
                duration='75 minutes',
            ),
        ]
        for workout in workouts:
            workout.save()
        self.stdout.write(f'Created {len(workouts)} workouts.')

        self.stdout.write(self.style.SUCCESS('Successfully populated octofit_db with superhero test data!'))
