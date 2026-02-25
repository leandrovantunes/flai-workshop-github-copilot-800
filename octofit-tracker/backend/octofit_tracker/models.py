from django.db import models


class User(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    password = models.CharField(max_length=100)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.name


class Team(models.Model):
    name = models.CharField(max_length=100)
    members = models.JSONField(default=list)

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class Activity(models.Model):
    user = models.CharField(max_length=100)
    activity_type = models.CharField(max_length=100)
    duration = models.CharField(max_length=50)
    date = models.DateField()

    class Meta:
        db_table = 'activities'

    def __str__(self):
        return f"{self.user} - {self.activity_type}"


class Leaderboard(models.Model):
    user = models.CharField(max_length=100)
    score = models.IntegerField()

    class Meta:
        db_table = 'leaderboard'

    def __str__(self):
        return f"{self.user} - {self.score}"


class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    duration = models.CharField(max_length=50)

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return self.name
