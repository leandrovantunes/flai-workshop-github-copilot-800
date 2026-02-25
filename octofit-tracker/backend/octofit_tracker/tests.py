from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email='ironman@avengers.com',
            name='Tony Stark',
            age=40,
            password='jarvis123',
        )

    def test_user_str(self):
        self.assertEqual(str(self.user), 'Tony Stark')

    def test_user_email_unique(self):
        with self.assertRaises(Exception):
            User.objects.create(
                email='ironman@avengers.com',
                name='Duplicate',
                age=30,
                password='test',
            )


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Team Marvel',
            members=['Tony Stark', 'Peter Parker'],
        )

    def test_team_str(self):
        self.assertEqual(str(self.team), 'Team Marvel')


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user='Tony Stark',
            activity_type='Iron Man Flight Training',
            duration='60 minutes',
            date=date(2024, 1, 10),
        )

    def test_activity_str(self):
        self.assertEqual(str(self.activity), 'Tony Stark - Iron Man Flight Training')


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(
            user='Thor Odinson',
            score=9500,
        )

    def test_leaderboard_str(self):
        self.assertEqual(str(self.entry), 'Thor Odinson - 9500')


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Iron Man Endurance',
            description='High-intensity cardio workout.',
            duration='60 minutes',
        )

    def test_workout_str(self):
        self.assertEqual(str(self.workout), 'Iron Man Endurance')


class UserAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            email='batman@dcheroes.com',
            name='Bruce Wayne',
            age=38,
            password='alfred123',
        )

    def test_list_users(self):
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        url = reverse('user-list')
        data = {
            'email': 'spiderman@avengers.com',
            'name': 'Peter Parker',
            'age': 22,
            'password': 'spidey123',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_user(self):
        url = reverse('user-detail', args=[self.user.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Bruce Wayne')


class TeamAPITest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Team Marvel',
            members=['Tony Stark', 'Peter Parker'],
        )

    def test_list_teams(self):
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_team(self):
        url = reverse('team-list')
        data = {'name': 'Team DC', 'members': ['Bruce Wayne', 'Clark Kent']}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ActivityAPITest(APITestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user='Diana Prince',
            activity_type='Lasso Combat Training',
            duration='75 minutes',
            date=date(2024, 1, 12),
        )

    def test_list_activities(self):
        url = reverse('activity-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardAPITest(APITestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(user='Thor Odinson', score=9500)

    def test_list_leaderboard(self):
        url = reverse('leaderboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Thunder God Strength',
            description='Heavy lifting inspired by Thor.',
            duration='90 minutes',
        )

    def test_list_workouts(self):
        url = reverse('workout-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ApiRootTest(APITestCase):
    def test_api_root(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_api_prefix_root(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
