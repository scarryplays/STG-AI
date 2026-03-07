from django.db import models

class DomainTrust(models.Model):
    domain = models.CharField(max_length=255, unique=True)
    trust_score = models.CharField(max_length=20)
    reason = models.TextField()
    Checked_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.domain} - {self.trust_score}"
